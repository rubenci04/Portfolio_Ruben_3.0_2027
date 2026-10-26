import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { FiArrowUpRight } from "react-icons/fi";
import { profile } from "../../data/profile";
import "./Contact.css";

const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setStatus("Enviando...");

    emailjs
      .sendForm(
        "service_x64oieo", // Tu Service ID
        "template_9d20gnb", // Tu Template ID
        form.current,
        {
          publicKey: "LOnhUWaNCJ8TZlRlG", // Tu Public Key
        },
      )
      .then(
        () => {
          setStatus("¡Mensaje enviado con éxito!");
          form.current.reset();
        },
        () => {
          setStatus("Error al enviar el mensaje. Inténtalo de nuevo.");
        },
      )
      .finally(() => setSending(false));
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
            onSubmit={sendEmail}
            className="contact-form"
            aria-busy={sending}
          >
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
        </div>
      </div>
    </section>
  );
};

export default Contact;
