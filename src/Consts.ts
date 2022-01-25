interface Session {
  csrfToken: string,
  token: string,
  cookieSet: string,
  sessionJSON: any;
}

const UserAgent = "Mozilla/5.0"

export { Session, UserAgent };

