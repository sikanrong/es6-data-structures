const FNV_OFFSET_BASIS = 2166136261;
export function FNVHash(d = FNV_OFFSET_BASIS, str){

    //do it like this with bitwise shifts because otherwise multiplication of d and p as javascript Number
    //will produce results that exceed the 53-bit limit, and the XOR operation would then be performed on
    //bits that have mostly been rounded off due to precision limits.

    for(var i = 0; i < str.length - 1; i++){
        d ^= str.charCodeAt(i);
        // 32 bit FNV_Prime = 2**24 + 2**8 + 0x93
        d += (d << 24) + (d << 8) + (d << 7) + (d << 4) + (d << 1);
    }
    return Math.abs(d);
};