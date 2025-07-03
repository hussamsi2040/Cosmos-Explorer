# 🌌 Cosmos Explorer

A comprehensive space education platform powered by Next.js, featuring real-time NASA data, AI-powered assistance, and interactive space exploration tools.

![Cosmos Explorer](https://img.shields.io/badge/Space-Education-blue?style=for-the-badge&logo=rocket)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![AI Powered](https://img.shields.io/badge/AI-Powered-purple?style=for-the-badge&logo=openai)

## 🚀 Features

### 🌙 Luna AI Assistant
- **100% AI-Powered**: Real-time responses using OpenRouter's o4-mini model
- **Space Education Expert**: Specialized knowledge in astronomy, astrophysics, and space exploration
- **Interactive Chat**: Full-screen chat interface with follow-up question suggestions
- **Contextual Learning**: AI generates relevant follow-up questions to deepen understanding
- **No Fallback Content**: Authentic AI responses for every query

### 🛰️ Real-Time Space Data
- **Launch Library 2 API**: Live rocket launch schedules from SpaceX, NASA, ULA, Blue Origin, ESA
- **NOAA Space Weather**: Real-time solar activity alerts and geomagnetic storm monitoring
- **Scientific Calculations**: Accurate moon phases and meteor shower predictions
- **Live Updates**: Fresh data with automatic refresh and error handling

### 📺 NASA TV Streaming
- **Live NASA Channels**: Direct access to NASA's live television programming
- **Series Categories**: Earth, ISS, Launches, Science, and special programming
- **Responsive Player**: Adaptive video streaming with modern controls
- **Program Information**: Detailed descriptions and scheduling information

### 🎯 Space Tracker
- **Satellite Tracking**: Real-time position data for spacecraft and satellites
- **Orbital Mechanics**: Interactive visualizations of celestial body movements
- **Mission Status**: Current status of active space missions
- **Educational Content**: Learn about orbital dynamics and space navigation

### 🌟 Cosmic Events
- **Multi-Tab Interface**: Organized sections for launches, astronomical events, and space weather
- **Interactive Filtering**: Filter events by month, type, and category
- **Real-Time Alerts**: Live notifications for important space events
- **Educational Context**: Detailed explanations for each event type

### 🎮 Space Games
- **Educational Gaming**: Interactive games that teach space concepts
- **Skill Building**: Progressive difficulty levels for different age groups
- **Achievement System**: Track learning progress through gamification
- **Fun Learning**: Engaging way to explore space science

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **AI Integration**: OpenRouter API with o4-mini model
- **Data Sources**: NASA APIs, Launch Library 2, NOAA Space Weather
- **Deployment**: Optimized for Vercel platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- OpenRouter API key (for Luna AI Assistant)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cosmos-explorer.git
   cd cosmos-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Add your OpenRouter API key to `.env.local`:
   ```env
   NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Luna AI Assistant Setup

1. **Get OpenRouter API Key**
   - Visit [OpenRouter.ai](https://openrouter.ai/keys)
   - Sign up and generate an API key
   - The key should start with `sk-or-v1-`

2. **Configure Environment Variables**
   ```env
   NEXT_PUBLIC_OPENROUTER_API_KEY=your_actual_api_key_here
   ```

3. **Restart Development Server**
   ```bash
   npm run dev
   ```

For detailed Luna AI setup instructions, see [LUNA_AI_SETUP.md](./LUNA_AI_SETUP.md)

## 📱 Application Pages

### 🏠 Home (`/cosmos-explorer`)
- Main landing page with navigation to all features
- Overview of available tools and resources
- Quick access to popular space content

### 🤖 Luna AI Assistant (`/luna-ai`)
- Full-screen AI chat interface
- Real-time space education assistance
- Follow-up question suggestions
- Space concepts library

### 🚀 Events (`/events`)
- Tabbed interface for different event types
- Real-time rocket launch data
- Astronomical event calculations
- Space weather monitoring

### 📡 Tracker (`/tracker`)
- Satellite and spacecraft tracking
- Orbital visualization tools
- Mission status updates

### 📺 NASA TV (`/cosmos-explorer/nasa-tv`)
- Live NASA television streaming
- Multiple channel categories
- Program scheduling and information

### 🎮 Games (`/games`)
- Educational space games
- Interactive learning experiences
- Progressive skill development

## 🌟 Key Features

### Real-Time Data Integration
- **Launch Library 2**: Upcoming rocket launches from all major space agencies
- **NOAA SWPC**: Live space weather alerts and solar activity monitoring
- **NASA APIs**: Official space agency data and imagery
- **Automated Updates**: Regular data refresh with fallback systems

### Educational Excellence
- **Age-Appropriate**: Content suitable for all learning levels
- **Scientific Accuracy**: Verified information from authoritative sources
- **Interactive Learning**: Hands-on exploration and discovery
- **Progressive Complexity**: From beginner to advanced concepts

### Modern User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Fast Performance**: Optimized loading and data fetching
- **Intuitive Navigation**: Clear structure and user-friendly interface
- **Accessibility**: Designed for users of all abilities

## 🎯 Use Cases

- **Educators**: Classroom teaching tool for space science
- **Students**: Interactive learning and homework assistance
- **Space Enthusiasts**: Stay updated with latest space activities
- **Researchers**: Access to real-time space data and events
- **Families**: Educational entertainment for all ages

## 🔮 Future Enhancements

- **Mobile App**: Native iOS and Android applications
- **VR Integration**: Virtual reality space exploration
- **Advanced AI**: Enhanced Luna AI with image recognition
- **Social Features**: User accounts and community interaction
- **Offline Mode**: Downloadable content for offline learning

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA**: For providing excellent APIs and educational resources
- **Launch Library**: For comprehensive rocket launch data
- **NOAA**: For space weather monitoring data
- **OpenRouter**: For AI integration capabilities
- **Next.js Team**: For the amazing framework
- **Vercel**: For hosting and deployment platform

## 📞 Support

- **Documentation**: Check our [docs](./docs) folder
- **Issues**: Report bugs on [GitHub Issues](https://github.com/your-username/cosmos-explorer/issues)
- **Discussions**: Join conversations in [GitHub Discussions](https://github.com/your-username/cosmos-explorer/discussions)

---

**Built with ❤️ for space education and exploration** 🚀🌌

*Inspiring the next generation of space explorers, one student at a time.*
