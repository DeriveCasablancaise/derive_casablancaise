import React from 'react';
import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

type ContactFormEmailProps = {
  message: string;
  senderEmail: string;
  senderName: string;
};

export default function ContactFormEmail({
  message,
  senderEmail,
  senderName,
}: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Un nouveau message de la part de Dérive Casablancaise</Preview>
      <Tailwind>
        <Body className="bg-gray-100 text-black">
          <Container>
            <Section className="bg-white borderBlack my-10 px-10 py-4 rounded-md">
              <Heading className="leading-tight">
                Vous avez reçu cet email de la part de {senderName}
              </Heading>
              <Text>{message}</Text>
              <Hr />
              <Text>
                <span className="font-bold">Nom:</span> {senderName}
              </Text>
              <Text>
                <span className="font-bold">Adresse Email:</span> {senderEmail}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
