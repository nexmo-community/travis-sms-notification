# Travis CI SMS Notifications

Travis CI has the ability to send notifications to a configured webhook. This project processes those notifications and sends an SMS message to the configured number.

## Usage

Feel free to [remix this project](https://glitch.com/edit/#!/remix/travis-sms-notification) on [Glitch](https://glitch.com).

You'll need to configure the following environment variables:

* `NEXMO_API_KEY` - Your Nexmo API Key
* `NEXMO_API_SECRET` - Your Nexmo API Secret
* `NEXMO_NUMBER` - The number you wish to send text messages from. Be sure to include the country code and only the numbers.
* `NOTIFICATION_NUMBER` - The number you wish to receive text messages on. Be sure to include the country code and only the numbers.
* `REPOSITORIES` - A comma-separated list of the repositories you wish to receive notifications for. This is a filtering mechanic to make sure nobody else is using your application.
* `TRAVIS_CONFIG_URL` - The URL of the relevant API server (See [Configuring Webhook Notifications](https://docs.travis-ci.com/user/notifications/#configuring-webhook-notifications))

Example:

```env
NEXMO_API_KEY=your-nexmo-key

NEXMO_API_SECRET=your-nexmo-secret

NEXMO_NUMBER=18005551234

NOTIFICATION_NUMBER=18005551111

REPOSITORIES=nexmo-community/travis-sms-notification,nexmo/nexmo-java

TRAVIS_CONFIG_URL=https://api.travis-ci.org/config
```

## Configure Travis CI

You can read more about configuring Travis CI by looking at [Configuring Webhook Notifications](https://docs.travis-ci.com/user/notifications/#configuring-webhook-notifications). Here's an example `.travis.yml`:

```yaml
language: generic
notifications:
  webhooks: https://travis-sms-notification.glitch.me/notifications
```
