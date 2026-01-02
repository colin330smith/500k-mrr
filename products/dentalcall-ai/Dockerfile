FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Set build environment
ARG NEXT_PUBLIC_APP_URL=https://local-lift.onrender.com
ARG NEXT_PUBLIC_SUPABASE_URL=https://fataxuuxjwibugjxekwm.supabase.co
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_placeholder

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build with memory limit
RUN node --max-old-space-size=512 ./node_modules/.bin/next build

EXPOSE 3000

CMD ["npm", "start"]
