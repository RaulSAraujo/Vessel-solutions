export interface ProfileData {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
}

export interface PasswordChangeData {
    current_password: string;
    new_password: string;
    confirm_password: string;
}
