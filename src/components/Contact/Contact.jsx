import { useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { profile } from "../../data/profile";
import "./Contact.css";

const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setStatus("Enviando...");

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form.current)).toString(),
      });
      if (!response.ok) throw new Error('Submission failed');
      setStatus('¡Mensaje enviado con éxito! Gracias por escribir.');
      form.current.reset();
    } catch {
      setStatus('No se pudo enviar el mensaje. Conservamos tu texto; podés intentarlo de nuevo o escribirme por WhatsApp.');
    } finally { setSending(false); }
  };

  return (
    <section id="contact" className="contact-container container">
      <div className="contact-panel">
        <div className="contact-copy">
          <div className="eyebrow">04 / El próximo proyecto</div>
          <h2>
            Las buenas ideas
            <br />
            empiezan con
            <br />
            <span>una conversación.</span>
          </h2>
          <p className="contact-subtitle">
            ¿Tenés un proyecto en mente o querés conectar? Contame qué estás
            imaginando.
          </p>

          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            También en LinkedIn <FiArrowUpRight />
          </a>
        </div>
        <div>
          <form
            ref={form}
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={sendEmail}
            className="contact-form"
            aria-busy={sending}
          >
            <input type="hidden" name="form-name" value="contact" />
            <div hidden><label>No completar <input name="bot-field" tabIndex="-1" autoComplete="off" /></label></div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Tu Nombre</label>
                <input
                  type="text"
                  name="from_name"
                  id="name"
                  autoComplete="name"
                  placeholder="¿Cómo te llamás?"
                  required
                  maxLength={120}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Tu Email</label>
                <input
                  type="email"
                  name="from_email"
                  id="email"
                  autoComplete="email"
                  placeholder="hola@ejemplo.com"
                  required
                  maxLength={254}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="message">Tu Mensaje</label>
              <textarea
                name="message"
                id="message"
                rows="5"
                placeholder="Hablemos de tu idea…"
                required
                maxLength={5000}
              ></textarea>
            </div>

            <button
              type="submit"
              className="button button-primary submit-button"
              disabled={sending}
            >
              {sending ? "Enviando…" : "Enviar mensaje"} <FiArrowUpRight />
            </button>
            <p className="contact-form-note">
              Usaré tus datos para responder a tu consulta.
            </p>
          </form>
          <p className="status-message" role="status" aria-live="polite">
            {status}
          </p>
          <a className="text-link" href={profile.whatsapp} target="_blank" rel="noreferrer">Escribirme por WhatsApp <FiArrowUpRight /></a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
