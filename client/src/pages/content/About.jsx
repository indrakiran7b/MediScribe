import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AboutPage = () => {
  const teamMembers = [
    { name: "Khambampati Subhash", role: "Team Member", avatar: "/api/placeholder/32/32" },
    { name: "Indra Kiran B", role: "Team Member", avatar: "/api/placeholder/32/32" },
    { name: "Ayyappa Swamy Thati", role: "Team Member", avatar: "/api/placeholder/32/32" },
    { name: "Sai Sumitha T", role: "Team Member", avatar: "/api/placeholder/32/32" },
    { name: "Rahul Krishnan", role: "Mentor", avatar: "/api/placeholder/32/32" }
  ];

  const features = [
    "Appointment Booking",
    "Voice Recording",
    "Transcription",
    "Summarization",
    "Structured Output"
  ];

  const industryNeeds = [
    "Efficient patient-doctor communication",
    "Accurate medical record keeping",
    "Time-saving documentation processes",
    "Enhanced accessibility to medical information",
    "Improved patient care through structured data"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-4xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 
        className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
        variants={itemVariants}
      >
        About MediScribe
      </motion.h1>
      
      <motion.section className="mb-12" variants={itemVariants}>
        <h2 className="text-3xl font-semibold mb-4 text-blue-700">Our Mission</h2>
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
          <CardContent className="p-6">
            <p className="text-lg text-gray-700 mb-4">
              MediScribe is revolutionizing the healthcare industry by bridging the gap between patients and doctors. 
              Our innovative platform streamlines the entire process from appointment booking to consultation 
              documentation, making healthcare more accessible and efficient.
            </p>
            <p className="text-lg text-gray-700">
              As a final year project from Amrita Vishwa Vidyapeetham's AIE A branch, we're committed to 
              creating a solution that addresses real-world challenges in the medical field.
            </p>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section className="mb-12" variants={itemVariants}>
        <h2 className="text-3xl font-semibold mb-4 text-blue-700">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-white hover:bg-blue-50 transition-colors duration-300 shadow-md hover:shadow-xl">
                <CardContent className="p-4">
                  <Badge className="mb-2" variant="secondary">{feature}</Badge>
                  <p className="text-gray-700">{getFeatureDescription(feature)}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section className="mb-12" variants={itemVariants}>
        <h2 className="text-3xl font-semibold mb-4 text-blue-700">Industry Impact</h2>
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
          <CardContent className="p-6">
            <ul className="space-y-2">
              {industryNeeds.map((need, index) => (
                <motion.li 
                  key={index} 
                  className="text-gray-700 flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-purple-500 mr-2">•</span> {need}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section className="mb-12" variants={itemVariants}>
        <h2 className="text-3xl font-semibold mb-4 text-blue-700">Our Team</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {teamMembers.map((member, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-white hover:bg-gray-50 transition-colors duration-300 shadow-md hover:shadow-xl">
                <CardContent className="p-4 text-center">
                  <Avatar className="mx-auto mb-2">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section variants={itemVariants}>
        <h2 className="text-3xl font-semibold mb-4 text-blue-700">Our Vision</h2>
        <Tabs defaultValue="vision" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vision">Vision</TabsTrigger>
            <TabsTrigger value="future">Future Plans</TabsTrigger>
          </TabsList>
          <TabsContent value="vision">
            <Card>
              <CardContent className="p-6">
                <p className="text-lg text-gray-700">
                  At MediScribe, we envision a future where technology seamlessly integrates with healthcare, 
                  enhancing the quality of patient care and reducing the administrative burden on medical professionals. 
                  By leveraging cutting-edge voice recognition, natural language processing, and data structuring 
                  technologies, we aim to set new standards in medical documentation and patient-doctor interaction.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="future">
            <Card>
              <CardContent className="p-6">
                <p className="text-lg text-gray-700">
                  Looking ahead, we plan to expand our platform to include AI-driven diagnosis assistance, 
                  personalized treatment recommendations, and integration with wearable health devices. 
                  Our goal is to create a comprehensive ecosystem that supports both patients and healthcare 
                  providers throughout the entire medical journey.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.section>
    </motion.div>
  );
};

const getFeatureDescription = (feature) => {
  switch (feature) {
    case "Appointment Booking":
      return "Effortlessly schedule appointments with the right specialists.";
    case "Voice Recording":
      return "Capture consultations with high-quality audio recording.";
    case "Transcription":
      return "Convert spoken words into accurate written text.";
    case "Summarization":
      return "Generate concise summaries of medical consultations.";
    case "Structured Output":
      return "Organize medical information into standardized, easily accessible formats.";
    default:
      return "";
  }
};

export default AboutPage;