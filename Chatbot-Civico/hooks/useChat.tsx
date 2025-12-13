import { useState, useCallback } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const simulateAIResponse = async (userMessage: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("report") || lowerMessage.includes("how do i")) {
    return `Great question! Here's how to report a civic issue on CivicConnects:

Step 1: Go to the "Report Issue" section in the app
Step 2: Select the type of issue (Waste Management, Water, Sanitation, Street Light, etc.)
Step 3: Provide the location details or enable GPS
Step 4: Add a description and photos if possible
Step 5: Submit your report

Once submitted, you'll receive a tracking ID to monitor the status. Our team forwards the issue to the relevant government department for action.

Is there a specific type of issue you'd like to report today?`;
  }

  if (lowerMessage.includes("resolve") || lowerMessage.includes("timeline") || lowerMessage.includes("how long") || lowerMessage.includes("when will")) {
    return `The resolution timeline depends on the type and severity of the issue:

Typical Resolution Times:
• Waste Management: 24-72 hours for garbage collection issues
• Water Supply: 48 hours - 1 week depending on the problem
• Sanitation: 3-7 days for sewage and drainage issues
• Street Lights: 1-2 weeks for repair or replacement
• Road Damage: 2-4 weeks depending on extent

You can track your issue status in real-time through the CivicConnects app. If an issue isn't resolved within the expected timeframe, you can escalate it through the app.

Would you like help tracking an existing issue?`;
  }

  if (lowerMessage.includes("waste") || lowerMessage.includes("garbage") || lowerMessage.includes("trash") || lowerMessage.includes("dump")) {
    return `Waste Management Issues include:

• Missed Garbage Collection - Regular pickup not happening
• Overflowing Bins - Public dustbins full and not cleared
• Illegal Dumping - Unauthorized waste disposal in public areas
• Hazardous Waste - Improper disposal of harmful materials
• Dead Animals - Carcasses requiring removal

How to Report:
1. Take a photo of the issue
2. Note the exact location
3. Submit through CivicConnects with category "Waste Management"

The municipal corporation typically responds within 24-72 hours for waste-related complaints.

Do you want to report a waste management issue right now?`;
  }

  if (lowerMessage.includes("water")) {
    return `Water Issues you can report:

• No Water Supply - Complete absence of water in your area
• Low Pressure - Inadequate water pressure
• Contaminated Water - Dirty, smelly, or discolored water
• Leaking Pipes - Water wastage from damaged pipelines
• Irregular Supply - Inconsistent water timing

Tips for Reporting:
- Mention your area and timing of the issue
- If contaminated, describe the color/smell
- Note if it affects just your home or the entire locality

The water department typically addresses urgent issues within 48 hours.

What specific water problem are you facing?`;
  }

  if (lowerMessage.includes("sanitation") || lowerMessage.includes("sewer") || lowerMessage.includes("drainage") || lowerMessage.includes("toilet")) {
    return `Sanitation Issues include:

• Blocked Drains - Clogged or overflowing drainage
• Sewage Overflow - Raw sewage in streets or public areas
• Open Defecation - Lack of public toilet facilities
• Dirty Public Toilets - Unmaintained community toilets
• Mosquito Breeding - Stagnant water causing health hazards

Why Report Sanitation Issues?
Poor sanitation leads to diseases like cholera, typhoid, and dengue. Your report helps create a healthier community!

Resolution Time: Usually 3-7 days depending on complexity.

Are you experiencing any sanitation problems in your area?`;
  }

  if (lowerMessage.includes("street") || lowerMessage.includes("light") || lowerMessage.includes("lamp")) {
    return `Street Light Issues you can report:

• Non-functional Lights - Street lamps not working
• Flickering Lights - Unstable lighting
• Broken Poles - Damaged street light infrastructure
• Dark Areas - Sections needing new lighting
• Exposed Wiring - Dangerous electrical hazards

Safety First!
Proper street lighting prevents accidents and crime. Don't hesitate to report even a single broken light!

How to Report:
- Note the pole number if visible
- Provide exact location/landmark
- Mention if it's a safety hazard

Typical resolution: 1-2 weeks for repairs.

Would you like to report a street light issue?`;
  }

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    return `Hello! 👋 I'm Civico, your CivicConnects assistant!

I'm here to help you with:
• Reporting Issues - Waste, water, sanitation, street lights & more
• Tracking Status - Check on your submitted complaints
• Understanding Categories - Learn about different civic issues
• Resolution Info - Know expected timelines

What would you like help with today?`;
  }

  return `Thank you for reaching out! I'm Civico, your CivicConnects assistant.

I can help you with:
• How to report civic issues (garbage, water, sanitation, street lights)
• Understanding different issue categories
• Expected resolution timelines
• Tracking your reported issues

Could you please tell me more specifically what you'd like to know? For example:
- "How do I report a garbage issue?"
- "What is a sanitation problem?"
- "How long to fix a street light?"`;
};

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: generateId(),
      title: "New conversation",
      messages: [],
      timestamp: new Date(),
    };
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    return newConversation.id;
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      let conversationId = activeConversationId;

      if (!conversationId) {
        conversationId = createNewConversation();
      }

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversationId) {
            const isFirstMessage = conv.messages.length === 0;
            return {
              ...conv,
              messages: [...conv.messages, userMessage],
              title: isFirstMessage ? content.slice(0, 40) + (content.length > 40 ? "..." : "") : conv.title,
              timestamp: new Date(),
            };
          }
          return conv;
        })
      );

      setIsTyping(true);
      try {
        const aiResponse = await simulateAIResponse(content);
        const assistantMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: aiResponse,
          timestamp: new Date(),
        };

        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                messages: [...conv.messages, assistantMessage],
              };
            }
            return conv;
          })
        );
      } finally {
        setIsTyping(false);
      }
    },
    [activeConversationId, createNewConversation]
  );

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    },
    [activeConversationId]
  );

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);

  const clearChat = useCallback(() => {
    setActiveConversationId(null);
  }, []);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    isTyping,
    sendMessage,
    createNewConversation,
    deleteConversation,
    selectConversation,
    clearChat,
  };
};
