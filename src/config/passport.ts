import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Container } from 'typedi';
import { env } from 'env';
import { UserService } from 'services/UserService';

const userService = Container.get(UserService);

const config = () => {
  passport.serializeUser((user, done) => {
    // 로그인 성공시 호출
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    // 로그인 이후 요청마다 호출
    done(null, user);
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.google.clientId,
        clientSecret: env.google.clientSecret,
        callbackURL: env.google.auth.callback
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await userService.findOrCreate({
          googleId: profile.id,
          name: profile._json.name,
          email: profile._json.email,
          profileImage: profile._json.picture
        });
        if (user) {
          done(null, user);
        } else {
          done(Error('create user error'), null);
        }
      }
    )
  );
};

export default {
  config
};
