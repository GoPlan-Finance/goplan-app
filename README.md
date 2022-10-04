<h1 align="center">
  <a href="http://goplan.finance/"><img src="https://github.com/GoPlan-Finance/GoPlan-app/raw/master/frontend/public/images/logos/logo-full.png" alt="Markdownify" width="400"></a>
  <br>
  GoPlan Finance
  <br>
</h1>

<h4 align="center">An intuitive portfolio manager!</h4>

<p align="center">

<a href="https://discord.gg/pG7BKV9WMg">
    <img src="https://img.shields.io/discord/814937752956698650.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2"
         alt="Discord">
  </a>
<a href="https://github.com/GoPlan-Finance/GoPlan-app/actions/workflows/ci.yml"><img src="https://github.com/GoPlan-Finance/GoPlan-app/actions/workflows/ci.yml/badge.svg"></a>
<a href="https://bestpractices.coreinfrastructure.org/projects/5557"><img src="https://bestpractices.coreinfrastructure.org/projects/5557/badge"></a>

	
</p>

<p align="center">
  :star: Star us on GitHub — it helps!
</p>



<p align="center">
  <a href="#roadmap">Roadmap</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#notes">Notes & disclamers</a> •
  <a href="#license">License</a>
</p>


![screenshot](https://github.com/GoPlan-Finance/GoPlan-app/raw/master/.github/screenshot-goplan.png)



# Roadmap

We seek to create a financial planning platform for the general public. Allocation dashboards, investment management tools, portfolio allocation, optimization, risk assessment, simulation, and forecasting. The tools of quantitative analysts and financial planners in hands of the regular investor and general public.

Feel free to submit a PR if you want to add items to the Roadmap!

### Version 1.0 (MVP)

- [ ] LandingPage #9
- [x] Login #2
- [x] Onboarding #25
- [x] Search for securities
- [x] Watchlist #8
    - Actions: Add/Delete
- [x] Dashboard
    - Total value, gains, percentage gains
    - Performance chart
    - Asset Type overview (Stock, bonds, cash...)
- [x] Transactions #7
    - Show all buy/sell/split transactions
    - Actions: Add/Edit/Delete
- [x] Holdings
    - shares, purchase date, average price, initial value, current price, current value, increase value, increase percentage, percentage of portfolio
    - actions: Buy/Sell/View
- [x] Stock Detail Page
- [ ] Fund Detail Page
- [ ] Settings
    - Default Currency
    - Download/Backup personal Data
    - Delete Account
- [x] Dockerize the application, and simplify initial setup
- [x] CSV import/export of transactions
- [x] Multiple Accounts  #6
    - Show all accounts by this user
    - Actions: Add/Edit/Delete

### Planned Features
- [ ] Non-financial/custom assets #3
- [ ] Allocations
	- Type (stock, bond, cash ...)
	- Industry (Tech, Consumer goods ...)
	- Region (US, Europe, Asia ...)
- [ ] Analytics
	- Volatility
	- Diversity #51
	- Performance
- [ ] Notifications #47
- [ ] Stock bundles #45
- [ ] Compare Assets #44
- [ ] Social features #46
    - Comments for financial assets
    - Share watchlists/bundles
    - Follow watchlists/bundles
- [ ] Multiple portfolios
- [ ] Customizable widgets
- [ ] Market research
- [ ] Advanced analytics
- [ ] Integrations with brokers


# How To Use

```bash
git clone https://github.com/GoPlan-Finance/GoPlan-app.git
cd goplan-app
```

### Prerequisites

- Node 14 or newer
- MongoDB version 3.6

### Install MongoDB

If you haven't already installed MongoDB, head over to https://docs.mongodb.com/manual/installation/ for instructions

### Build project

This project uses yarn workspaces. So running the following command will install the dependencies for all workspaces (backend, frontend and common).
```
yarn install
```

### Run the backend

- Copy `backend/config/config.defaults.ts` to `backend/config/config.ts` and Edit the configuration file:
  - Database URL:
  - Master Key: Can be any arbitrary string
  - Data provider(s) API Keys: We currently only support https://eodhistoricaldata.com, further API providers are planned in the future.

```
cd backend
yarn run backend-serve
```

### Run the Frontend

```
cd frontend
yarn run frontend-serve
```

visit https://local.goplan.finance:3000

## Testing and debugging
### Backend

```
cd backend
yarn install

# This will rebuild the backend, and restart it when you make change in the code
yarn run watch-debug
```


**If you find anoying  `watch-debug` restarts the server on every changes. You can do this**

Open a separate terminal and run (and leave runnning) :
```
yarn run watch-ts
```

When you are ready to test your changes:
```
yarn run serve-debug
```

### (Optionally) Parse Dashboard

Parse Dashboard is a standalone dashboard for managing the GoPlan Parse Server. (https://github.com/parse-community/parse-dashboard)

install dashboard locally

```
npm install -g parse-dashboard
```

Launch dashboard

```
parse-dashboard --dev --appId goplan-finance --masterKey yourMasterKey --serverURL "http://localhost:1337/parse"
```

# How to contribute

- You have an idea ?  [Submit it in Discussions](https://github.com/GoPlan-Finance/GoPlan-app/discussions)
- You found a bug ?  [Submit it in Issues](https://github.com/GoPlan-Finance/GoPlan-app/issues)
- You found a **security** issue ?  [Contact a moderator in private](https://github.com/orgs/GoPlan-Finance/teams/core-team/members)
- You want to chat ? [Say Hi! On discord](https://discord.gg/pG7BKV9WMg)



# Notes

## A note on Warranty and Limitation of Liability.

We are not in any way professional traders, financials experts or financial advisors. This is an open source project created by passionate developers for free.

Considering that this application is related to the financial sector and stock market, there is a special attention that was drawn toward ensuring accuracy of the information displayed and how the handling of confidential information is made.

That said, the good faith and commitment of the team in this project shall not be in any case confused for a warranty of any sort.

Please refer to section `16` and `17` of  the [LICENSE](LICENSE) for any details

## A note on Security and data privacy
This project handle private financial informations, our goal is to protect to a maximum each users privacy and confidential informations.

That said, once again, the good faith and commitment of the team in this project shall not be in any case confused for a warranty of any sort.

The information exchanged between the client and server are on a [need to know](https://en.wikipedia.org/wiki/Need_to_know) basis. That means, that we will use client-sie encryption on all the data we can in order to ensure that even in a case of a security issue, your personal data is protected.

### Examples
| Type of data                          | Client side encryption                  | Why?                                    |
| ------------------------------------- | --------------------------------------- | --------------------------------------- |
| # of shares bougth or sold            | Yes :closed_lock_with_key:	          | No need to know for the server          |
| Date of purchace order                | No                                      | Server need to filter and sort orders   |
| Ticker symbol of order                | No                                      | Server need to process time-series and pre-fetch API data |
| Name of your private  Watchlists      | Yes :closed_lock_with_key:              | No need to know                         |
| Name of your shared   Watchlists      | No                                      | Name need to be stored in text to allow other users to see it |
| Name of your Accounts/Assets          | Yes :closed_lock_with_key:              | No need to know                         |

## A note on cryptography and data protection
This project has not been, for now, reviewed by an independent security firm. We are open to a partnership.



# License

GPL v3



