export interface IRegister {
  name: string;
  email: string;
  password: string;
}

export interface ILogin {
  email: string;
  password: string;
}
export interface ISendOTP {
  email: string;
}

export interface IVerifyOTP {
  email: string;
  otp: string;
}

// user login
export interface Auth {
  provider: string;
  providerId: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  isDeleted: boolean;
  isVerified: boolean;
  isActive: string;
  role: string;
  auths: Auth[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: User;
}
