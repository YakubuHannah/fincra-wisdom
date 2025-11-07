const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const Document = require('../models/Document');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Ask AI endpoint
router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // 1. Search relevant documents - IMPROVED
    let documents;

    // Check if it's a general "list all" type question
    const listAllKeywords = ['what documents', 'all documents', 'show me documents', 'list documents', 'available documents'];
    const isListAllQuery = listAllKeywords.some(keyword => question.toLowerCase().includes(keyword));

    if (isListAllQuery) {
      // Return all documents for general queries
      documents = await Document.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .populate('departmentId');
    } else {
      // Smart search for specific queries
      const searchTerms = question.toLowerCase().split(' ').filter(word => word.length > 3);
      
      if (searchTerms.length > 0) {
        documents = await Document.find({
          $or: [
            { title: { $regex: searchTerms.join('|'), $options: 'i' } },
            { summary: { $regex: searchTerms.join('|'), $options: 'i' } },
            { content: { $regex: searchTerms.join('|'), $options: 'i' } },
            { searchableText: { $regex: searchTerms.join('|'), $options: 'i' } },
            { departmentName: { $regex: searchTerms.join('|'), $options: 'i' } },
            { category: { $regex: searchTerms.join('|'), $options: 'i' } },
            { tags: { $in: searchTerms.map(term => new RegExp(term, 'i')) } }
          ]
        }).limit(10).populate('departmentId');
      } else {
        // Fallback: return recent documents
        documents = await Document.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('departmentId');
      }
    }

    // 2. Build context from documents
    let context = "Here are relevant documents from Fincra's knowledge base:\n\n";
    
    for (const doc of documents) {
      context += `Document: ${doc.title}\n`;
      context += `Department: ${doc.departmentName}\n`;
      context += `Category: ${doc.category}\n`;
      if (doc.summary) {
        context += `Summary: ${doc.summary}\n`;
      }
      context += `\n`;
    }

    // 3. Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Fincra Wisdom, an AI assistant helping Fincra employees find information. You have access to company documents and should provide helpful, accurate answers. If you don't find relevant information in the provided context, say so and provide general guidance based on what you know about fintech companies. Be concise and professional.`
        },
        {
          role: "user",
          content: `Context from company documents:\n${context}\n\nQuestion: ${question}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const answer = completion.choices[0].message.content;

    // 4. Return response
    res.json({
      success: true,
      answer,
      relevantDocuments: documents.map(doc => ({
        _id: doc._id,
        title: doc.title,
        departmentName: doc.departmentName,
        category: doc.category,
        slug: doc.slug
      }))
    });

  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ 
      error: 'Failed to process question',
      message: error.message 
    });
  }
});

module.exports = router;