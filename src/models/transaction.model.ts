export default interface transactionInterface {
    accountNumber: number
    accountAgency: number
    amount: Number
    date: Date
    type: 'withdrawal' | 'deposit'
}