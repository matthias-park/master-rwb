import { SettingsField } from './user/ProfileSettings';

interface RequiredDocuments {
  id: string;
  action: string;
  title: string;
  fields: SettingsField[];
}

export default RequiredDocuments;
