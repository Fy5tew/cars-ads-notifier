export type CarAd = {
    id: number,
    title: string,
    params: string,
    year: string,
    mileage: string,
    location: string,
    date: string,
    photoURL: string,
    price: {
        BYN: string,
        USD: string,
    },
};
