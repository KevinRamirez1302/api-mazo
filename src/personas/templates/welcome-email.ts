export const welcomeEmailTemplate = (nombre: string, curso: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', Arial, sans-serif;
            background-color: #ECF4E8;
            color: #1a2e1d;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            border: 1px solid #CBF3BB;
        }
        .header {
            background-color: #93BFC7;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .content {
            padding: 40px;
            text-align: left;
            line-height: 1.6;
        }
        .content h2 {
            color: #1a2e1d;
            font-size: 24px;
            margin-top: 0;
        }
        .content p {
            color: #2d4a33;
            font-size: 16px;
        }
        .badge {
            display: inline-block;
            background-color: #CBF3BB;
            color: #1a2e1d;
            padding: 8px 16px;
            border-radius: 12px;
            font-weight: 600;
            margin: 10px 0;
        }
        .footer {
            background-color: #ECF4E8;
            padding: 30px;
            text-align: center;
            font-size: 14px;
            color: #5a7a61;
            border-top: 1px solid #CBF3BB;
        }
        .button {
            display: inline-block;
            background-color: #93BFC7;
            color: #ffffff;
            padding: 14px 28px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 25px;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #72a5ae;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Bienvenido!</h1>
        </div>
        <div class="content">
            <h2>Hola ${nombre},</h2>
            <p>Nos alegra informarte que tu registro se ha completado con éxito. Ya eres parte de nuestra comunidad enfocada en el aprendizaje y el crecimiento profesional.</p>
            
            <p>Te has inscrito correctamente en:</p>
            <div class="badge">${curso}</div>
            
            <p>Estamos emocionados de acompañarte en este proceso educativo. Muy pronto recibirás más detalles sobre el inicio de las clases y los materiales necesarios.</p>
            
            <a href="https://mazo.dev" class="button">Ir a mi plataforma</a>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Mazo. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
    </div>
</body>
</html>
`;
