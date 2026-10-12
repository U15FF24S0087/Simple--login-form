import jwt from 'jsonwebtoken';

export default function authenticateToken(request, response, next) {
  const authorization = request.get('authorization');
  const [scheme, token] = authorization?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ message: 'Please log in to continue.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof payload === 'string' || !payload.sub) {
      return response.status(401).json({ message: 'Your session is invalid.' });
    }

    request.userId = payload.sub;
    return next();
  } catch {
    return response.status(401).json({
      message: 'Your session is invalid or has expired. Please log in again.'
    });
  }
}
