const { execSync } = require('child_process');

console.log('Installing missing TypeScript type declarations...');

try {
  execSync('npm install --save-dev @types/jsonwebtoken @types/bcryptjs', { stdio: 'inherit' });
  console.log('Successfully installed type declarations!');
} catch (error) {
  console.error('Failed to install type declarations:', error);
}

console.log('\nCreating .env file...');
const fs = require('fs');

const envContent = `# Authentication
JWT_SECRET=e30d6e2f7c7f67a67312191d3ed4a9c8e49dea0ba1717d9411a6b352604e1530
TWILIO_ACCOUNT_SID=AC343cd237db67b08bcb5d63d2abb6a670
TWILIO_AUTH_TOKEN=145897a8004777ed111a1872a884d64c
TWILIO_PHONE_NUMBER=+14155552671
TWILIO_WHATSAPP_NUMBER=+14155238886

# Email
RESEND_API_KEY=re_ZdCYRTep_LEXn3W6YJtDtgVDxC8KZXyjq

# Database
MONGODB_URI=mongodb+srv://RailMadadCMS:<railmadad@123>@cluster0.f8hst.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# OpenAI (for chatbot)
OPENAI_API_KEY=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
`;

try {
  if (!fs.existsSync('.env')) {
    fs.writeFileSync('.env', envContent);
    console.log('Created .env file with placeholder values.');
    console.log('Please update the .env file with your actual values.');
  } else {
    console.log('.env file already exists. Skipping creation.');
  }
} catch (error) {
  console.error('Failed to create .env file:', error);
}

console.log('\nSetup complete!');

