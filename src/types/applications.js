
/**
 * @typedef {Object} Application
 * @property {string} id - The unique identifier for the application
 * @property {string} user_id - The user ID who submitted the application
 * @property {string} applicant_id - The profile ID of the applicant
 * @property {string} application_type - The type of application (adoption, foster, volunteer)
 * @property {string} status - The status of the application (pending, in-review, approved, rejected)
 * @property {Object} form_data - The form data submitted by the applicant
 * @property {string} created_at - When the application was created
 * @property {string} updated_at - When the application was last updated
 * @property {string} [reviewed_at] - When the application was reviewed
 * @property {string} [reviewer_id] - The ID of the user who reviewed the application
 * @property {string} [feedback] - Feedback on the application
 * @property {Object} [profiles] - The profile information of the applicant
 */

export {};
