import jwt from 'jsonwebtoken';

/**
 * Generates a Tinybird JWT token with very long expiration
 */
export function generateTinybirdJWT() {
  // Your workspace ID from Tinybird
  const workspaceId = "105ceecb-29a7-447c-952f-3907db59658d";
  
  // Hard-coded admin token (without the 'p.' prefix)
  const adminToken = "eyJ1IjogIjhlNWE4ZWE0LWVhNjEtNGY4YS05YzU2LTk0ZDNmYTUyOTJhMSIsICJpZCI6ICIxMDVjZWVjYi0yOWE3LTQ0N2MtOTUyZi0zOTA3ZGI1OTY1OGQiLCAiaG9zdCI6ICJ1cy1lYXN0LWF3cyJ9.i8FRli3ydDLVHurICSMn2LZeaLVU-LvxJcY4CqvbvYE";
  const signingKey = adminToken;
  
  // Set expiration to 10 years from now (effectively "unlimited")
  const expirationTime = Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60);
  
  // Create JWT payload
  const payload = {
    workspace_id: workspaceId,
    name: "papermark_app_token",
    exp: expirationTime,
    scopes: [
      // Add all necessary pipe scopes
      {
        type: "PIPES:READ",
        resource: "*" // Wildcard to access all pipes
      },
      // Explicitly add data sources for write access if needed
      {
        type: "DATASOURCES:WRITE",
        resource: "page_views__v3"
      },
      {
        type: "DATASOURCES:WRITE",
        resource: "click_events"
      },
      {
        type: "DATASOURCES:WRITE",
        resource: "pm_click_events"
      },
      {
        type: "DATASOURCES:WRITE",
        resource: "video_views"
      },
      {
        type: "DATASOURCES:WRITE",
        resource: "webhook_events__v1"
      }
    ]
  };
  
  // Sign the JWT with the admin token
  return jwt.sign(payload, signingKey, { algorithm: 'HS256' });
}

/**
 * Creates a script to generate and print a token to the console
 * This function can be called from a command line script
 */
export function printGeneratedToken() {
  try {
    const token = generateTinybirdJWT();
    console.log("Generated Tinybird JWT Token:");
    console.log(token);
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    process.exit(1);
  }
}

// If this file is executed directly (not imported), print the token
if (require.main === module) {
  printGeneratedToken();
}