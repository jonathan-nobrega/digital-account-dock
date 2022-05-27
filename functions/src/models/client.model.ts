/**
 * Standard Project object from Books API documentation
 */
 export interface projectInterface {
    organization_id: number
    customer_id: string
    users:
    {
        users_ids: string[]
        users_emails: string[]
    }
    project_id: string
    project_name: string
    customer_name: string
    description: string
    billing_type: string
}