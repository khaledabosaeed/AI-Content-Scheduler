"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { container, item } from "../../../components/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Twitter, Facebook, Linkedin } from "lucide-react";

const platforms = [
  { icon: <Instagram className="h-10 w-10 text-pink-500" />, name: "Instagram" },
  { icon: <Twitter className="h-10 w-10 text-blue-400" />, name: "Twitter" },
  { icon: <Facebook className="h-10 w-10 text-blue-700" />, name: "Facebook" },
  { icon: <Linkedin className="h-10 w-10 text-blue-600" />, name: "LinkedIn" },
];

const IntegrationsSection: FC = () => (
  <motion.section
    id="integrations"
    className="py-20 px-6 bg-gray-50"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={container}
  >
    <div className="max-w-6xl mx-auto text-center mb-10">
      <motion.h3 variants={item} className="text-3xl font-bold mb-3">
        Supported Platforms
      </motion.h3>
      <motion.p variants={item} className="text-gray-600">
        Connect seamlessly to your favorite social media platforms.
      </motion.p>
    </div>

    <motion.div
      variants={container}
      className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto"
    >
      {platforms.map((platform, idx) => (
        <motion.div
          key={idx}
          variants={item}
          whileHover={{ scale: 1.05, y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="h-full flex flex-col justify-center items-center shadow-md hover:shadow-lg transition-shadow duration-300 py-6">
            <CardContent className="flex flex-col items-center text-center p-4">
              <div>{platform.icon}</div>
              <p className="font-semibold text-lg mt-3">{platform.name}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  </motion.section>
);

export default IntegrationsSection;
