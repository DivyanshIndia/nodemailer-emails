import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Configure transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: 'OAuth2',
        user: process.env.G_USER_EMAIL,
        clientId: process.env.G_CLIENT_ID,
        clientSecret: process.env.G_CLIENT_SECRET,
        refreshToken: process.env.G_REFRESH_TOKEN,
    },
    pool: true, // Use pooled connections
    maxConnections: 1, // Limit concurrent connections
    rateDelta: 1000, // Minimum time between emails
    rateLimit: 30, // Maximum number of emails per second
});

// Cover letter template
const coverLetter = `
Dear Hiring Manager,

I am writing to express my strong interest in the Software Developer / Full Stack Developer position at your company. With over a year of professional experience in full-stack development and a strong foundation in modern web technologies, I believe I would be a valuable addition to your team.

Currently serving as a Software Developer at PIP Trade in Delhi, I have led frontend development using React.js and Next.js while also contributing significantly to backend development with Node.js and MongoDB. My experience includes:

• Leading the development of a comprehensive forex trading platform
• Implementing monitoring solutions using Loki and Grafana
• Developing admin web applications for client management
• Building responsive and user-friendly interfaces

My technical skills include:
• Frontend: React.js, Next.js, HTML5, CSS3, Tailwind CSS, Javascript, TypeScript, Redux toolkit, tanstackQuery, tanstackTable, tanstackForm
• Backend: Node.js, Express.js, 
• Database: MongoDB, MySQL
• Mobile Development: React Native, Expo
• DevOps: Git, GitHub, Loki, Grafana

I am particularly drawn to this opportunity because it aligns perfectly with my expertise in full-stack development and my passion for creating efficient, scalable solutions. I am confident that my combination of technical skills and practical experience would enable me to make meaningful contributions to your team from day one.

I would welcome the opportunity to discuss how my skills and experience align with your needs in more detail. Thank you for considering my application.

Best regards,
Divyansh Bhatt
8755346738
linkedin.com/in/divyanshbhatt0
`;

// Function to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Function to send a single email
const sendEmail = async (toEmail, attemptNumber = 1) => {
    const mailOptions = {
        from: process.env.G_USER_EMAIL,
        to: toEmail,
        subject: "Application for Software Developer / Full Stack Developer Position - Divyansh Bhatt",
        text: coverLetter,
        attachments: [
            {
                filename: 'Divyansh_Bhatt_Resume.pdf',
                path: path.join(__dirname, 'divyansh_bhatt_resume.pdf')
            }
        ]
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✓ Email sent successfully to ${toEmail}`);
        return { success: true, email: toEmail, messageId: info.messageId };
    } catch (error) {
        console.error(`✗ Error sending to ${toEmail}:`, error.message);
        if (attemptNumber < 3) {  // Retry failed emails up to 3 times
            console.log(`Retrying ${toEmail} (Attempt ${attemptNumber + 1}/3)...`);
            await delay(1000 * attemptNumber);  // Exponential backoff
            return sendEmail(toEmail, attemptNumber + 1);
        }
        return { success: false, email: toEmail, error: error.message };
    }
};

// Function to process email list with batching
async function processBulkEmails(emailListFile, batchSize = 50) {
    try {
        const emailList = (await fs.readFile(emailListFile, 'utf-8'))
            .split('\n')
            .map(email => email.trim())
            .filter(email => email && email.includes('@'));

        console.log(`Starting to process ${emailList.length} emails...`);

        const results = {
            successful: [],
            failed: [],
            startTime: new Date(),
            endTime: null
        };

        // Process in batches
        for (let i = 0; i < emailList.length; i += batchSize) {
            const batch = emailList.slice(i, i + batchSize);
            console.log(`\nProcessing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(emailList.length/batchSize)}`);

            const batchResults = await Promise.all(
                batch.map(email => sendEmail(email))
            );

            // Collect results
            batchResults.forEach(result => {
                if (result.success) {
                    results.successful.push(result.email);
                } else {
                    results.failed.push({ email: result.email, error: result.error });
                }
            });

            // Add delay between batches to avoid overwhelming the server
            if (i + batchSize < emailList.length) {
                console.log('\nWaiting 60 seconds before next batch...');
                await delay(60000);
            }
        }

        results.endTime = new Date();

        // Generate report
        const report = {
            totalEmails: emailList.length,
            successfulSent: results.successful.length,
            failedSent: results.failed.length,
            timeElapsed: (results.endTime - results.startTime) / 1000 / 60, // in minutes
            failedEmails: results.failed
        };

        // Save report to file
        await fs.writeFile(
            'email_sending_report.json', 
            JSON.stringify(report, null, 2)
        );

        console.log('\nEmail sending completed!');
        console.log(`Successfully sent: ${report.successfulSent}`);
        console.log(`Failed: ${report.failedSent}`);
        console.log(`Time taken: ${report.timeElapsed.toFixed(2)} minutes`);
        console.log('Detailed report saved to email_sending_report.json');

    } catch (error) {
        console.error('Error processing email list:', error);
    } finally {
        transporter.close();
    }
}


const emailListFile = 'email_list.txt';  // Create this file with one email per line

processBulkEmails(emailListFile).catch(console.error);


