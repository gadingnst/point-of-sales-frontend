export const rupiah = (number = 0) => {
    try {
        let splitted
        number = Number.isNaN(number) || number.toFixed(2)
        splitted = String(number).split('.')
        number = String(splitted[0]).split('').reverse().join('')
        number = number.match(/\d{1,3}/g)
        return 'Rp. ' + `${splitted[1].split('').reverse().join('')},${number.join('.')}`.split('').reverse().join('')
    } catch (err) {
        console.error(err)
        return 0
    }
}

export const formatDateID = date => {
    date = date ? new Date(date) : new Date()
    return date.toLocaleString('en-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Jakarta'
    })
}