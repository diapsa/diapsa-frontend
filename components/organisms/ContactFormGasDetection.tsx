import { FormEvent, useRef, useState } from "react";
import Modal from "../atoms/Modal";
import { ContacFormGasDetection } from "@/types/contact";
import { useContactForm } from "@/lib/hooks/useContactForm";
import InputField, { SelectField, TextareaField } from "../atoms/InputField";
import Button from "../atoms/Button";
import { sanitizeContactFormData } from "@/lib/utils/sanitizeFormData";
import SuccessMessage from "../atoms/SuccessMessage";
import RateLimitNotice, { RateLimitBanner } from "../molecules/RateLimitNotice";

interface ContactFormGasDetectionProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;

}


const countries = [
    { value: 'México', label: 'México' },
    { value: 'Estados Unidos', label: 'Estados Unidos' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Chile', label: 'Chile' },
    { value: 'Perú', label: 'Perú' },
    { value: 'España', label: 'España' },
    { value: 'Otro', label: 'Otro' },
];

export default function ContactFormGasDetection({ isOpen, onClose, onSuccess }: ContactFormGasDetectionProps) {
    const {
        submitForm,
        loading,
        success,
        errors: apiErrors,
        rateLimitExceeded,
        retryAfter,
        resetForm,
        validateField
    } = useContactForm();
    const [formData, setFormData] = useState<ContacFormGasDetection>({
        name: '',
        email: '',
        phone: '',
        company: '',
        form_type: 'gas',
        custom_fields: {
            subject: '',
            message: ''
        }
    });
    const formRef = useRef<HTMLFormElement>(null);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [showSuccess, setShowSuccess] = useState(false);

    // Get error message for field
    const getFieldError = (field: string): string | undefined => {
        if (fieldErrors[field]) return fieldErrors[field];
        if (apiErrors[field]) return apiErrors[field][0];
        return undefined;
    };

    const handleBlur = (field: string, value: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));

        const error = validateField(field, value);
        if (error) {
            setFieldErrors((prev) => ({ ...prev, [field]: error }))
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        const customFields = ['subject', 'message'];
        if (customFields.includes(name)) {
            setFormData((prev) => ({
                ...prev,
                custom_fields: { ...prev.custom_fields, [name]: value } as ContacFormGasDetection['custom_fields'],
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {}

        const nameError = validateField('name', formData.name)
        if (nameError) newErrors.name = nameError;

        const emailError = validateField('email', formData.email);
        if (emailError) newErrors.email = emailError;

        if (formData.phone) {
            const phoneError = validateField('phone', formData.phone);
            if (phoneError) newErrors.phone = phoneError;
        }

        if (formData.company) {
            const companyError = validateField('company', formData.company);
            if (companyError) newErrors.company = companyError
        }

        if (formData.country) {
            const countryError = validateField('country', formData.country);
            if (countryError) newErrors.country = countryError
        }

        if (!formData.custom_fields?.subject) {
            newErrors.subject = 'Selecciona en que parte del servicio estas interesado'
        }

        if (Object.keys(newErrors).length > 0) {
            setFieldErrors(newErrors);
            return
        }

        console.log(formData);

        const sanitizedData = sanitizeContactFormData(formData);
        const result = await submitForm(sanitizedData);

        if (result) {
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                form_type: 'gas',
                custom_fields: {
                    subject: '',
                    message: ''
                }
            })
            setFieldErrors({});
            formRef.current?.reset();
            onClose();
            setShowSuccess(true);
            onSuccess?.();
        }
    };

    return (
        <>
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
                        <SuccessMessage
                            message="¡Registro confirmado! Un especialista de DIAPSA se pondrá en contacto contigo."
                            icon
                            onDismiss={() => { resetForm(); setShowSuccess(false); }}
                        />
                    </div>
                </div>
            )}
            <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl w-full">
                {rateLimitExceeded && retryAfter && (
                    <div className="p-8">
                        <RateLimitNotice retryAfter={retryAfter} onRetryReady={resetForm} />
                    </div>
                )}
                {!rateLimitExceeded && (
                    <form ref={formRef} onSubmit={handleSubmit} className={`space-y-6`}>
                        <div className="p-8 space-y-3">
                            <div className="">

                                <p className="text-2xl font-semibold text-primary mb-2">Diapsa | Detección de Gas</p>
                                <p className="text-sm font-medium text-gray-500">Dejenos tus datos y un especialista de DIAPSA se pondra en contacto contigo para asesorarte en tus proyectos de deteccion de gas.</p>
                            </div>
                            {/* Name */}
                            <InputField
                                label="Nombre completo"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={(e) => handleBlur('name', e.target.value)}
                                error={getFieldError('name')}
                                required
                                disabled={loading}
                            />
                            {/* Email */}
                            <InputField
                                label="Correo electrónico"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={(e) => handleBlur('email', e.target.value)}
                                error={getFieldError('email')}
                                required
                                disabled={loading}
                            />
                            {/* Phone */}
                            <InputField
                                label="Telefono"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={(e) => handleBlur('phone', e.target.value)}
                                error={getFieldError('phone')}
                                required
                                disabled={loading}
                            />
                            <div className="flex gap-3">
                                {/* Country */}
                                <SelectField
                                    label="País"
                                    name="country"
                                    options={countries}
                                    value={formData.country}
                                    onChange={handleChange}
                                    placeholder="Selecciona tu país"
                                    disabled={loading}
                                    containerClassName="flex-1"
                                />

                                {/* Company */}
                                <InputField
                                    label="Empresa"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    containerClassName="flex-1"
                                />
                            </div>
                            {/* Subject */}
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">¿En qué estás interesado? <span className="text-red-500">*</span></p>
                                <div className="flex gap-4">
                                    {[
                                        { value: 'Servicio', label: 'Servicio' },
                                        { value: 'Equipo técnico', label: 'Equipo técnico' },
                                        { value: 'Servicio y equipo', label: 'Ambos' },
                                    ].map((option) => (
                                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="subject"
                                                value={option.value}
                                                checked={formData.custom_fields?.subject === option.value}
                                                onChange={handleChange}
                                                disabled={loading}
                                                className="accent-secondary w-4 h-4"
                                            />
                                            <span className="text-sm text-gray-700">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>


                            {/* Message */}
                            <TextareaField
                                label="Cuéntanos cómo podemos ayudarte"
                                name="message"
                                value={formData.custom_fields?.message || ''}
                                onChange={handleChange}
                                rows={4}
                                helperText=""
                                disabled={loading}
                            />

                            {/* Honeypot */}
                            <input
                                type="text"
                                name="website"
                                value=""
                                onChange={() => { }}
                                style={{ display: 'none' }}
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                            />

                            <Button className="w-full">Enviar </Button>
                        </div>
                    </form>
                )}
            </Modal>
        </>
    )
} 