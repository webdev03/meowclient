interface SessionJSON {
  user: {
    id: number;
    banned: boolean;
    username: string;
    token: string;
    thumbnailUrl: string;
    dateJoined: string;
    email: string;
  };
  permissions: {
    admin: boolean;
    scratcher: boolean;
    new_scratcher: boolean;
    social: boolean;
    educator: boolean;
    educator_invitee: boolean;
    student: boolean;
    mute_status: any; // not sure, it is an object though
  };
  flags: {
    must_reset_password: boolean;
    must_complete_registration: boolean;
    has_outstanding_email_confirmation: boolean;
    show_welcome: boolean;
    confirm_email_banner: boolean;
    unsupported_browser_banner: boolean;
    project_comments_enabled: boolean;
    gallery_comments_enabled: boolean;
    userprofile_comments_enabled: boolean;
  };
}

interface Session {
  csrfToken: string;
  token: string;
  cookieSet: string;
  sessionJSON: SessionJSON;
}

const UserAgent = "Mozilla/5.0";

export {Session, UserAgent, SessionJSON};
