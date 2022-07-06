


export const addressShortener = (_address) => {

    const first4 = _address.slice(0, 5);
    const last4 = _address.slice(-5);

    return first4 + "....." + last4
}