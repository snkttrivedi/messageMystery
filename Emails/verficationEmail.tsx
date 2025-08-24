import React from 'react';
import { Html, Head, Preview, Body, Container, Heading, Text } from '@react-email/components';

interface EmailTemplateProps {
  username: string;
  otp: string;
}

const VerifyEmailTemplate: React.FC<EmailTemplateProps> = ({ username, otp }) => {
  return (
    <Html>
      <Head />
      <Preview>Your OTP Code</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Hello, {username}!</Heading>
          <Text style={paragraph}>Thank you for using our service. To complete your verification, please use the following One-Time Password (OTP):</Text>
          <Text style={otpStyle}>{otp}</Text>
          <Text style={paragraph}>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</Text>
          <Text style={paragraph}>If you did not request this verification, please ignore this email or contact support.</Text>
          <Text style={paragraph}>Best regards,</Text>
          <Text style={paragraph}>Your Company Name</Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f6f6f6',
  padding: '20px',
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
};

const h1 = {
color: '#333',
fontSize: '24px',
fontWeight: 'bold',
marginBottom: '20px',
};

const paragraph = {
fontSize: '16px',
lineHeight: '1.6',
marginBottom: '20px',
};

const otpStyle = {
fontSize: '24px',
fontWeight: 'bold',
color: '#333',
marginBottom: '20px',
};

export default VerifyEmailTemplate;