interface SettingForm {
  id: string;
  action: string;
  title: string;
  errors: string[];
  fields: {
    id: string;
    title: string;
    errors: string[];
    status: string;
    date: string;
    type: string;
  }[];
}

interface ProfileSettings {
  token: string;
  status: null;
  profile_info: {
    last_login: {
      title: string;
      value: string;
    };
  };
  forms: SettingForm[];
}

export default ProfileSettings;
