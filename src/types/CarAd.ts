export type CarAd = {
    id: number,
    title: string,
    params: string,
    year: string,
    mileage: string,
    location: string,
    date: string,
    url: string,
    photoURL: string,
    price: {
        free: false,
        BYN: string,
        USD: string,
    } | {
        free: true,
    },
};
