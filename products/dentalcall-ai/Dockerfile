FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install --production=false

# Copy source
COPY . .

# Build-time environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_APP_URL=https://local-lift.onrender.com
ENV NEXT_PUBLIC_SUPABASE_URL=https://fataxuuxjwibugjxekwm.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51SPT4IQbwtzxbB4U8isKvIQBBF4Te7HjeIh37XwGOGWt8VhbkjjsrYIHR770D7iv1vPLUl8DSDlRy3p83htAljxQ006l3ipgMm

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "start"]
