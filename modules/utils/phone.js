function formatEgyptianPhoneNumber(number) {
    if (!number) return number;
    let num = number.trim().replace(/[^\d+]/g, '');
    if (num.startsWith('00')) num = '+' + num.slice(2);
    if (num.startsWith('0') && num.length > 1) num = num.slice(1);
    if (num.startsWith('+20')) return num;
    if (num.startsWith('20')) return '+' + num;
    if (num.startsWith('+')) return num;
    if (num.length === 10) return '+20' + num;
    if (num.length === 11 && num[0] === '1') return '+20' + num;
    return '+20' + num;
}
module.exports = { formatEgyptianPhoneNumber };
