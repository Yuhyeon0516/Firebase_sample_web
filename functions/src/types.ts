export interface INaverProfile {
    response: {
        email: string;
        id: string;
        name: string;
    };
}

export interface IKakaoProfile {
    id: number;
    kakao_account: {
        email: string;
        profile: {
            nickname?: string;
        };
    };
}
