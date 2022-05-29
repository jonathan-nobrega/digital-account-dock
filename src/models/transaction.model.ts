export default interface transactionInterface {
    accountId: string
    amount: Number
    date: Date
    type: 'withdrawal' | 'deposit'
}