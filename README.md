# Google Analytics for Enonic XP

This guide helps you set up the Google Analytics app for Enonic XP.

Important: This integration requires a Google Analytics 4 account and does not support deprecated Universal Analytics.

## Contents

- [Building and deploying](#building-and-deploying)
- [Set up Google Analytics app for Enonic XP](#set-up-google-analytics-app-for-enonic-xp)
  - [Tracking](#tracking)
  - [Widget](#widget)
  - [Maps API key](#maps-api-key)
  - [Content Security Policy](#content-security-policy)

## Building and deploying

Build this application from the command line:

```bash
./gradlew clean build
```

To deploy the app, set the `XP_HOME` environment variable and run:

```bash
./gradlew deploy
```

## Set up Google Analytics app for Enonic XP
### Tracking

To enable the tracking script on your site, you need the Google Analytics Measurement ID.

1. In Google Analytics, select the correct account for your website, then click the cog icon in the lower-left corner.
2. Click **Data Streams** in the right-hand menu.

![Google Analytics admin panel](docs/images/AdminPanel.png)

3. Click a data stream on the **Web** tab to open Web stream details.

![Data stream details](docs/images/DataStream.png)

4. Locate **Measurement ID** and copy the value.
5. Log in to Enonic XP and open Content Studio.

Tip: If you have not installed the Google Analytics app yet, install it from Applications in the XP Launcher panel (XP icon in the top-right corner).

6. In Content Studio, edit your site, add the Google Analytics application, and open app config (pencil icon).

![Site application config](docs/images/SiteApplication.png)

7. Paste the Measurement ID into the config field and enable tracking by checking **Enable tracking**.

![App settings](docs/images/AppSettings.png)

When you publish the site, the tracking script goes live and starts collecting analytics data.

### Widget

Setting up the widget requires a few more steps and gives a useful overview of site statistics.

Important: This setup requires access to configuration files on the server hosting Enonic XP.

1. Open the Analytics admin page (cog icon in the lower-left corner).
2. Click **Property Settings** in the right-hand menu.

![Property settings](docs/images/PropertySettings.png)

3. Locate **Property ID** and copy it.

![Property ID](docs/images/PropertyId.png)

4. Paste it into the **Property Id** field in the app config form in Content Studio.

![App property settings](docs/images/AppSettingsPropertyId.png)

You are done with the site setup.

Next, set up a service account and app configuration:

1. Go to [Google Cloud console](https://console.cloud.google.com) and create an account if needed.
2. Open [APIs and Services](https://console.cloud.google.com/apis/dashboard) and click **+ Enable APIs and Services**.

![Enable APIs](docs/images/Enable_APIs.png)

3. Search for **Google Analytics Data API**, select it, and click **Enable**.
4. Open [IAM and Admin](https://console.cloud.google.com/iam-admin) and select **Service Accounts**.

![Service accounts](docs/images/CloudAdminServiceAccounts.png)

5. Create a service account for API access. Give it a name and generate a Service account ID (email), then click **Create and Continue**.

![Create service account](docs/images/ServiceAccountCreate.png)

6. Open the new service account and go to the **Keys** tab.

![Service account keys](docs/images/ServiceAccountKeys.png)

7. Add a new key of type `json`. A file will be generated and downloaded. Store it securely.
8. Create an app config file named `com.enonic.app.ga.cfg` in `{xp_home}/config` on the server.
9. Add this line to that config file:

```properties
ga.credentialPath = ${xp.home}/config/<key_file_name.json>
```

Replace `<key_file_name.json>` with the downloaded key file name.

10. Upload the key file to the same folder as the config file.

Now grant the service account access in Google Analytics:

1. Copy the service account email from the service account list.
2. Go to **Property Access Management** in Google Analytics Admin.

![Property access management](docs/images/ProperyAccessManagment.png)

3. Add a new user.

![Add property user](docs/images/NewPropertyUser.png)

4. Use the service account email and grant a viewer role for analytics data.

After adding the user, the widget should show your site data.

### Maps API key

To show the world map in the GA widget, enable Maps JavaScript API and configure the key.

1. Go to [APIs and Services](https://console.cloud.google.com/apis/dashboard).
2. Click **Enable APIs and services** and search for `maps javascript api`.
3. Enable the API and get a Maps API key.
4. Add this line to your config file:

```properties
ga.mapsApiKey = <google_maps_api_key_here>
```

### Content Security Policy

The widget uses remote assets (fonts, styles, and scripts from Google servers) that are blocked by default in Content Studio CSP.

To allow required resources, add this line to Content Studio config file `/{$xp_home}/config/com.enonic.app.contentstudio.cfg`:

```properties
contentSecurityPolicy.header=default-src 'self' https://*.gstatic.com; connect-src 'self' ws: wss: https://*.gstatic.com https://*.googleapis.com; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.google.com https://*.googleapis.com https://*.gstatic.com; object-src 'none'; style-src 'self' 'unsafe-inline' http://*.googleapis.com https://*.googleapis.com https://*.gstatic.com; img-src 'self' https://*.gstatic.com data:; frame-src 'self' https://*.googleapis.com;
```
