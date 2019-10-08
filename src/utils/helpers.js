export const rupiah = (number = 0) => {
    try {
        number = Number.isNaN(number) || number
        number = String(number).split('').reverse().join('')
        number = number.match(/\d{1,3}/g)
        return 'Rp. ' + `00,${number.join('.')}`.split('').reverse().join('')
    } catch (err) {
        console.error(err)
        return 0
    }
}