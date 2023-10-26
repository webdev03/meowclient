import ScratchSession from "./ScratchSession";

interface SessionJSON {
  user: {
    id: number;
    banned: boolean;
    should_vpn: boolean;
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
    invited_scratcher: boolean;
    social: boolean;
    educator: boolean;
    educator_invitee: boolean;
    student: boolean;
    mute_status:
      | {
          offenses: {
            expiresAt: number;
            messageType: string | null;
          }[];
          showWarning: boolean;
          muteExpiresAt: number;
          currentMessageType: string | null;
        }
      | {};
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
    everything_is_totally_normal: boolean;
  };
}

type Session = ScratchSession | undefined;

const UserAgent = "Mozilla/5.0";

export { Session, UserAgent, SessionJSON };
