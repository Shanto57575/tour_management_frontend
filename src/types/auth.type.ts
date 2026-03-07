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

export interface IUser {
  _id: string;
  name: string;
  email: string;
  isDeleted: boolean;
  isVerified: boolean;
  isActive: string;
  role: string;
  auths: Auth[];
  picture?: string;
  image?: string | File;
  address?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface UpdateUserPayload {
  userId: string;
  userInfo: FormData;
}

export interface ISetPassword {
  password: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IResetPassword {
  id: string;
  password: string;
  token: string;
}
