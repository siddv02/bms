import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  Button,
  IconButton,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { Close, Send, SupportAgent } from '@mui/icons-material';

const Chat = ({ onClose }) => {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setConversation((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/support/chat', {
        message,
        context: 'nexabiz-customer-query'
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.reply
      };

      setConversation((prev) => [...prev, aiMessage]);
    } catch (error) {
      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Sorry, I'm having trouble connecting to our support system right now."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">NexaBiz AI Support</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            height: 400,
            overflowY: 'auto',
            mb: 2,
            p: 1,
            backgroundColor: theme.palette.background.default,
            borderRadius: 2
          }}
        >
          <List>
            {conversation.map((msg, index) => (
              <ListItem
                key={index}
                sx={{
                  justifyContent:
                    msg.role === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start'
                }}
              >
                {msg.role === 'assistant' && (
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <SupportAgent />
                    </Avatar>
                  </ListItemAvatar>
                )}

                <Box
                  sx={{
                    maxWidth: '75%',
                    bgcolor:
                      msg.role === 'user'
                        ? theme.palette.primary.main
                        : theme.palette.grey[200],
                    color: msg.role === 'user' ? 'white' : 'black',
                    p: 1.5,
                    borderRadius: 2,
                    boxShadow: 1
                  }}
                >
                  <ListItemText
                    primary={msg.content}
                    sx={{ wordBreak: 'break-word' }}
                  />
                </Box>
              </ListItem>
            ))}

            {isLoading && (
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    <SupportAgent />
                  </Avatar>
                </ListItemAvatar>
                <Box
                  sx={{
                    bgcolor: theme.palette.grey[200],
                    p: 1.5,
                    borderRadius: 2,
                    boxShadow: 1,
                    color: 'black'
                  }}
                >
                  <ListItemText primary="Thinking..." />
                </Box>
              </ListItem>
            )}
          </List>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            gap: 1,
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Ask about invoices, subscriptions, reports..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            endIcon={<Send />}
            disabled={!message.trim() || isLoading}
          >
            Send
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Chat;
