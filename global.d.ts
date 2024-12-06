import type { Href } from "expo-router";

declare global {
  type AppIcon =
    | "ic_eye_close"
    | "ic_eye_open"
    | "ic_arrow_forward"
    | "ic_pause"
    | "ic_close"
    | "ic_volume"
    | "ic_arrow_back"
    | "ic_play"
    | "ic_time_clock"
    | "ic_star"
    | "ic_bookmark"
    | "ic_book"
    | "ic_bell"
    | "ic_glass"
    | "ic_home"
    | "ic_profile"
    | "ic_location";

  namespace Layout {
    type ScreenData = {
      width: number;
      height: number;
      orientation: "portrait" | "landscape";
      displayMode: "phone" | "tablet";
    };

    type ResponsiveData = {
      screenData: ScreenData;
    };
  }

  namespace Form {
    type Login = {
      email: string;
      password: string;
    };

    type Register = Login & {
      confirmPassword: string;
    };

    type ResetPassword = Pick<Login, "email">;

    type RecoverPassword = Omit<Register, "email">;

    type UpdateProfileName = {
      firstName: string;
      lastName: string;
    };

    type UpdateProfileEmail = {
      email: string;
      confirmEmail: string;
    };

    type UpdateProfilePassword = {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    };
  }

  namespace Navigation {
    type UpdateSuccessParams = {
      title: string;
      description: string;
      subDescription?: string;
      template?: "send-email" | "default";
      shouldReplace?: number;
      prevPage?: string;
    };
  }

  type StorageKey = "ACCESS_TOKEN" | "USER_DATA" | "USER_SKIP";
}

export {};
