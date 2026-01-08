const nodemailer = require('nodemailer');

// Create transporter (using Gmail as example - can be configured for other services)
const createTransporter = () => {
  // For development/testing, use ethereal email
  if (process.env.NODE_ENV !== 'production' && !process.env.EMAIL_USER) {
    return null; // Will log to console instead
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * Send notification email when user's turn is approaching
 */
const sendTurnApproachingEmail = async (userEmail, userName, queueName, position, peopleAhead) => {
  const transporter = createTransporter();
  
  const mailContent = {
    subject: `⏰ Your turn is approaching - ${queueName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .highlight { background: #667eea; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .highlight h2 { margin: 0; font-size: 48px; }
          .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 SkipLine</h1>
            <p>Your turn is almost here!</p>
          </div>
          <div class="content">
            <p>Hello <strong>${userName}</strong>,</p>
            <p>Great news! Your turn in <strong>${queueName}</strong> is approaching.</p>
            
            <div class="highlight">
              <p style="margin: 0;">Your Position</p>
              <h2>#${position}</h2>
              <p style="margin: 0;">${peopleAhead} ${peopleAhead === 1 ? 'person' : 'people'} ahead of you</p>
            </div>
            
            <p>📍 Please make your way to the service counter soon.</p>
            <p>⚠️ If you miss your turn, you may need to rejoin the queue.</p>
            
            <div class="footer">
              <p>This is an automated message from SkipLine Queue Management System</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  if (!transporter) {
    return { success: true, mode: 'dev' };
  }

  try {
    await transporter.sendMail({
      from: `"SkipLine" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: mailContent.subject,
      html: mailContent.html
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Send notification when it's the user's turn
 */
const sendYourTurnEmail = async (userEmail, userName, queueName) => {
  const transporter = createTransporter();
  
  const mailContent = {
    subject: `🔔 IT'S YOUR TURN - ${queueName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .alert { background: #10b981; color: white; padding: 30px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .alert h2 { margin: 0; font-size: 36px; }
          .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 SkipLine</h1>
            <p>It's Your Turn!</p>
          </div>
          <div class="content">
            <p>Hello <strong>${userName}</strong>,</p>
            
            <div class="alert">
              <h2>🔔 IT'S YOUR TURN!</h2>
              <p style="margin: 10px 0 0 0;">Please proceed to the counter immediately</p>
            </div>
            
            <p><strong>Queue:</strong> ${queueName}</p>
            <p>⚡ Please proceed to the service counter immediately.</p>
            <p>⚠️ If you don't arrive within 5 minutes, your turn may be skipped.</p>
            
            <div class="footer">
              <p>This is an automated message from SkipLine Queue Management System</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  if (!transporter) {
    return { success: true, mode: 'dev' };
  }

  try {
    await transporter.sendMail({
      from: `"SkipLine" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: mailContent.subject,
      html: mailContent.html
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Send queue joined confirmation email
 */
const sendQueueJoinedEmail = async (userEmail, userName, queueName, position, estimatedWait) => {
  const transporter = createTransporter();
  
  const mailContent = {
    subject: `✅ You've joined ${queueName} - Position #${position}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          .position { font-size: 48px; font-weight: bold; color: #667eea; }
          .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ SkipLine</h1>
            <p>Queue Joined Successfully!</p>
          </div>
          <div class="content">
            <p>Hello <strong>${userName}</strong>,</p>
            <p>You have successfully joined the queue.</p>
            
            <div class="info-box">
              <p><strong>Queue:</strong> ${queueName}</p>
              <p><strong>Your Position:</strong> <span class="position">#${position}</span></p>
              <p><strong>Estimated Wait:</strong> ~${estimatedWait} minutes</p>
            </div>
            
            <p>📱 You will receive a notification when your turn is approaching.</p>
            <p>💡 <strong>Tip:</strong> Keep this email handy to track your position.</p>
            
            <div class="footer">
              <p>Thank you for using SkipLine!</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  if (!transporter) {
    return { success: true, mode: 'dev' };
  }

  try {
    await transporter.sendMail({
      from: `"SkipLine" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: mailContent.subject,
      html: mailContent.html
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendTurnApproachingEmail,
  sendYourTurnEmail,
  sendQueueJoinedEmail
};
