-- Create ENUM type for message_status
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');

-- Create ENUM type for message_type
CREATE TYPE message_type AS ENUM ('text', 'image', 'video');

-- Create ENUM type for conversation_type
CREATE TYPE conversation_type AS ENUM ('direct', 'group');

-- Users table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(255) UNIQUE,
  about VARCHAR(255)
);

-- Conversations table
CREATE TABLE conversations (
  conversation_id SERIAL PRIMARY KEY,
  conversation_type conversation_type NOT NULL,
  last_message_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Conversations and Users (Join Table)
CREATE TABLE conversation_participants (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(conversation_id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  message_id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(conversation_id),
  sender_id INTEGER REFERENCES users(user_id),
  receiver_id INTEGER REFERENCES users(user_id),
  message_type message_type NOT NULL,
  message_content VARCHAR(255),
  sent_at TIMESTAMP DEFAULT NOW(),
  message_status message_status DEFAULT 'sent'
);