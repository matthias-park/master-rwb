import React, { createRef, useState, useMemo, useEffect } from 'react';
import AccountPageTemplate from '../components/account-settings/AccountTemplate';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { useForm, FormProvider } from 'react-hook-form';
import CustomSelectInput from '../../../components/customFormInputs/CustomSelectInput';
import { useI18n } from '../../../hooks/useI18n';
import LoadingButton from '../../../components/LoadingButton';
import CustomAlert from '../components/CustomAlert';
import { postApi } from '../../../utils/apiUtils';
import { useToasts } from 'react-toast-notifications';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useApi from '../../../hooks/useApi';
import Spinner from 'react-bootstrap/Spinner';

export const FilePicker = () => {
  const { data, error, mutate } = useApi<any>(
    '/railsapi/v1/user/profile/required_documents',
  );
  const isDataLoading = !data && !error;
  const { addToast } = useToasts();
  const { t } = useI18n();

  const [addedFiles, setAddedFiles] = useState<
    { id: string; name: string; size: number; type: string }[]
  >([]);
  const [fileInputRefs, setFileInputRefs] = useState<{
    [id: string]: React.RefObject<HTMLInputElement> | null;
  }>({});
  const [filesLength, setFilesLength] = useState({});
  const formMethods = useForm<any, any>({
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState,
    reset,
  } = formMethods;

  const [subTypes, setSubTypes] = useState<{ id: string; value: number }[]>([]);
  const watchDocumentType = watch('document_type');
  const [updatedFile, setUpdatedFile] = useState<string | null>(null);
  const documentTypeValues = useMemo(() => {
    return data?.documents?.reduce((prev, curr) => {
      if (curr.types) {
        const subTypes = curr.types.map(type => type.id);
        return [...prev, ...subTypes];
      } else {
        return [...prev, curr.id];
      }
    }, []);
  }, [data]);

  useEffect(() => {
    if (data && data.documents) {
      resetUpload();
    }
  }, [data]);

  useEffect(() => {
    updatedFile && selectFile();
  }, [updatedFile]);

  const resetUpload = () => {
    setFileInputRefs(
      data?.documents?.reduce(
        (prev, document) => ((prev[document.id] = createRef()), prev),
        {},
      ),
    );
    setFilesLength(
      data?.documents?.reduce(
        (prev, document) => ((prev[document.id] = 0), prev),
        {},
      ),
    );
    setAddedFiles([]);
    reset();
  };

  useEffect(() => {
    if (data && data.documents) {
      resetUpload();
    }
  }, [data]);

  useEffect(() => {
    updatedFile && selectFile();
  }, [updatedFile]);

  const selectFile = () => {
    if (updatedFile) {
      fileInputRefs[updatedFile]?.current?.click();
      return;
    }
    const selectedDocument = data.documents.find(
      document =>
        document.id === watchDocumentType ||
        document?.types?.find(type => type.id === watchDocumentType),
    );
    selectedDocument &&
      fileInputRefs[
        `${selectedDocument?.id}${
          filesLength[selectedDocument.id]
            ? '_' + filesLength[selectedDocument.id]
            : ''
        }`
      ]?.current?.click();
  };

  const addFile = e => {
    if (!e.target.files[0]) return setUpdatedFile(null);

    const subTypeDocument = data.documents.find(document =>
      document?.types?.find(type => type.id === watchDocumentType),
    );
    const subType =
      subTypeDocument &&
      subTypeDocument?.types?.find(subType => subType.id === watchDocumentType);

    const fileLength = filesLength[subTypeDocument?.id || watchDocumentType];
    const filePostFix = !fileLength ? '' : `_${fileLength}`;

    if (subTypeDocument && subType) {
      const existingSubType = subTypes.find(
        subType =>
          subType.id === `${subTypeDocument.id}${filePostFix}_sub_type`,
      );

      if (existingSubType) {
        const updatedSubTypeIndex = subTypes.findIndex(
          subType => subType.id === existingSubType.id,
        );
        const updatedSubTypes = [...subTypes];
        updatedSubTypes[updatedSubTypeIndex] = {
          id: existingSubType.id,
          value: existingSubType.value,
        };
        setSubTypes(updatedSubTypes);
      } else {
        setSubTypes([
          ...subTypes,
          {
            id: `${subTypeDocument.id}${filePostFix}_sub_type`,
            value: subType.value,
          },
        ]);
      }
      setValue(`${subTypeDocument.id}${filePostFix}_sub_type`, subType.value);
    }

    if (updatedFile) {
      updateFile(e.target.files[0], updatedFile);
    } else {
      setAddedFiles([
        ...addedFiles,
        {
          id: `${subTypeDocument?.id || watchDocumentType}${filePostFix}`,
          name: e.target.files[0].name,
          size: e.target.files[0].size,
          type: watchDocumentType,
        },
      ]);
      setFileInputRefs({
        ...fileInputRefs,
        [`${subTypeDocument?.id || watchDocumentType}${
          '_' + (fileLength + 1)
        }`]: createRef(),
      });
      setFilesLength(prevState => ({
        ...prevState,
        [subTypeDocument?.id || watchDocumentType]:
          prevState[subTypeDocument?.id || watchDocumentType] + 1,
      }));
      setValue(
        `${subTypeDocument?.id || watchDocumentType}${filePostFix}`,
        e.target.files[0],
      );
    }
  };

  const updateFile = (file, id) => {
    const updatedFileIndex = addedFiles.findIndex(
      file => file.id === updatedFile,
    );
    const updatedFileList = [...addedFiles];
    updatedFileList[updatedFileIndex] = {
      id: id,
      name: file.name,
      size: file.size,
      type: addedFiles[updatedFileIndex].type,
    };
    setAddedFiles(updatedFileList);
    setUpdatedFile(null);
    setValue(id, file);
  };

  const deleteFile = id => {
    const updatedFiles = addedFiles.filter(file => file.id !== id);
    setAddedFiles(updatedFiles);

    const updatedFileRefs = Object.entries(fileInputRefs).reduce(
      (prev, [key, value]) => {
        return key === id ? prev : (prev[key] = value), prev;
      },
      {},
    );
    setValue(id, null);
    setFileInputRefs(updatedFileRefs);

    const updatedSubTypes = subTypes.filter(
      subType => subType.id !== `${id}_sub_type`,
    );
    setSubTypes(updatedSubTypes);
    setValue(`${id}_sub_type`, null);
  };

  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);

  const onSubmit = async body => {
    body = Object.entries(body).reduce(
      (prev, [k, v]) => (v ? ((prev[k] = v), prev) : prev),
      {},
    );
    delete body.document_type;
    const formatBody = data.documents.reduce((prev, document) => {
      const documentFiles = Object.entries(body)
        .filter(([k, v]) => k.toString().includes(document.id))
        .map(item => item[1]);
      return documentFiles.length
        ? ((prev[`${document.id}[]`] = documentFiles), prev)
        : prev;
    }, {});
    const res = await postApi<RailsApiResponse<null>>(data.action, formatBody, {
      formData: true,
    }).catch((res: RailsApiResponse<null>) => {
      if (res.Fallback) {
        addToast(`Failed to update user settings`, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
      return res;
    });
    if (res?.Success) resetUpload();
    mutate();
    setApiResponse({
      success: res.Success,
      msg: res.Message || t('api_response_failed'),
    });
  };

  return (
    <>
      <CustomAlert
        show={!!apiResponse}
        variant={
          (apiResponse && (apiResponse.success ? 'success' : 'danger')) || ''
        }
      >
        <div dangerouslySetInnerHTML={{ __html: apiResponse?.msg || '' }} />
      </CustomAlert>
      {isDataLoading && (
        <div className="d-flex my-3">
          <Spinner animation="border" variant="white" />
        </div>
      )}
      {!!data && (
        <>
          <h6 className="account-page__content-title mb-sm">Upload Files</h6>
          <p className="account-page__content-text">
            Max file size: 8.00MB, Allowed file types: .jpg, .jpeg, .png, .pdf,
            .gif
          </p>
          <div className="documents-container">
            <FormProvider {...formMethods}>
              <Form
                onSubmit={handleSubmit(onSubmit)}
                className="d-flex align-items-start flex-column flex-lg-row"
              >
                {documentTypeValues && fileInputRefs && (
                  <>
                    <CustomSelectInput
                      key={'document_type'}
                      id={'document_type'}
                      className="mr-lg-2 mw-300"
                      rules={{}}
                      values={[
                        {
                          text: 'select_type',
                          value: '-1',
                        },
                        ...documentTypeValues.map(type => ({
                          text: type,
                          value: type,
                        })),
                      ]}
                      title={t('document_type')}
                      setValue={setValue}
                    />
                    {Object.entries(fileInputRefs).map(([key, value]) => (
                      <input
                        {...register(key)}
                        key={key}
                        ref={value}
                        type="file"
                        className="d-none"
                        id={key}
                        onChange={addFile}
                      />
                    ))}
                    {subTypes.map(subType => (
                      <input
                        {...register(subType.id)}
                        key={subType.id}
                        id={subType.id}
                        type="hidden"
                        value={subType.value}
                      />
                    ))}
                  </>
                )}
                <div className="d-flex">
                  <Button
                    variant="tertiary"
                    className="rounded-pill mr-1 mb-0 mt-lg-3"
                    disabled={watchDocumentType === '-1'}
                    onClick={selectFile}
                  >
                    Choose File
                  </Button>
                  <LoadingButton
                    className="rounded-pill mt-lg-3"
                    type="submit"
                    loading={!!formState.isSubmitting}
                    disabled={!addedFiles.length}
                  >
                    Upload Files
                  </LoadingButton>
                </div>
              </Form>
            </FormProvider>
          </div>
          {!!addedFiles.length && (
            <Table hover responsive className="mt-2">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Size</th>
                  <th>Type</th>
                  <th className="text-center text-md-right">Options</th>
                </tr>
              </thead>
              <tbody>
                {addedFiles.map(
                  file =>
                    file && (
                      <tr className="fade-in">
                        <div className="mobile-td-wrp">
                          <span className="mobile-th">File Name</span>
                          <td>{file.name}</td>
                        </div>
                        <div className="mobile-td-wrp">
                          <span className="mobile-th">Size</span>
                          <td>{file.size / 1000} KB</td>
                        </div>
                        <div className="mobile-td-wrp">
                          <span className="mobile-th">Type</span>
                          <td>{t(file.type)}</td>
                        </div>
                        <div className="mobile-td-wrp">
                          <span className="mobile-th">Options</span>
                          <td className="text-center text-md-right">
                            <i
                              className="icon-edit mr-2"
                              onClick={() => setUpdatedFile(file.id)}
                            ></i>
                            <i
                              className="icon-delete"
                              onClick={() => deleteFile(file.id)}
                            ></i>
                          </td>
                        </div>
                      </tr>
                    ),
                )}
              </tbody>
            </Table>
          )}
          {data?.documents?.some(document => document?.uploaded?.length) && (
            <>
              <hr className="divider-solid-light d-none d-xl-block" />
              <h6 className="account-page__content-title mt-6">My Documents</h6>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Upload Date</th>
                    <th>Type</th>
                    <th>Expiry Date</th>
                    <th>Issue Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.documents?.map(
                    item =>
                      item?.uploaded?.length &&
                      item?.uploaded?.map(item => (
                        <tr key={item.id}>
                          <div className="mobile-td-wrp">
                            <span className="mobile-th">File Name</span>
                            <td> - </td>
                          </div>
                          <div className="mobile-td-wrp">
                            <span className="mobile-th">Upload Date</span>
                            <td>{item?.date}</td>
                          </div>
                          <div className="mobile-td-wrp">
                            <span className="mobile-th">Type</span>
                            <td>{t(item.id)}</td>
                          </div>
                          <div className="mobile-td-wrp">
                            <span className="mobile-th">Expiry Date</span>
                            <td> - </td>
                          </div>
                          <div className="mobile-td-wrp">
                            <span className="mobile-th">Issue Date</span>
                            <td> - </td>
                          </div>
                          <div className="mobile-td-wrp">
                            <span className="mobile-th">Status</span>
                            <td>
                              {t(item.status)}{' '}
                              <i className="icon-circle-check ml-3"></i>
                            </td>
                          </div>
                        </tr>
                      )),
                  )}
                </tbody>
              </Table>
            </>
          )}
        </>
      )}
    </>
  );
};

const DocumentsPage = () => {
  const { t } = useI18n();

  return (
    <AccountPageTemplate
      title={t('document_page_title')}
      text={t('document_page_note')}
    >
      <FilePicker />
    </AccountPageTemplate>
  );
};

export default DocumentsPage;
