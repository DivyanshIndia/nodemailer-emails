# Bulk Email Sending Application

A Node.js application for sending bulk emails using Gmail with OAuth2 authentication.

## Features

- Sends bulk emails using Gmail
- Retries failed emails up to 3 times
- Processes emails in batches
- Generates a report of sent emails
- Uses OAuth2 for secure authentication
- Validates email addresses

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or above)
- [npm](https://www.npmjs.com/)
- Gmail account
- OAuth2 credentials for Gmail API

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```
   G_USER_EMAIL=your-email@gmail.com
   G_CLIENT_ID=your-gmail-api-client-id
   G_CLIENT_SECRET=your-gmail-api-client-secret
   G_REFRESH_TOKEN=your-gmail-api-refresh-token
   ```

   To obtain OAuth2 credentials:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Gmail API
   - Create credentials (OAuth client ID)
   - Set up the OAuth consent screen
   - Generate refresh token (Follow this [guide](https://developers.google.com/identity/protocols/oauth2/web-server#httprest_3))

4. Create `email_list.txt` with one email per line.

5. Place your resume as `divyansh_bhatt_resume.pdf` in the project root.

## Usage

Run the application:
```bash
npm start
```

For more information on using Nodemailer with Gmail, check out the [Nodemailer documentation](https://nodemailer.com/usage/using-gmail/).

## Output

- `email_sending_report.json`: Report of sent and failed emails.

## Project Structure

```
.
├── email_list.txt
├── divyansh_bhatt_resume.pdf
├── emailValidator.js
├── index.js
├── .env
├── .gitignore
└── README.md
```

## Notes

- Respect Gmail's sending limits. Read more about [Gmail's sending limits](https://support.google.com/a/answer/166852?hl=en)
- Keep the `.env` file secure. Learn about [environment variable best practices](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html)

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Additional Resources

- [Nodemailer GitHub Repository](https://github.com/nodemailer/nodemailer)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Sending Multiple Emails With Attachment and Cover Letter using Gmail and Nodemailer][def]

[def]: https://ahead-rhinoceros-d4f.notion.site/Sending-Multiple-Emails-With-Attachment-and-Cover-Letter-using-Gmail-and-Nodemailer-114fed47ba1f80c4a475c11cd2a11705