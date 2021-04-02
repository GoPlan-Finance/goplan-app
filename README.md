# GoPlan-app

## Intent

We seek to create a financial planning platform for the general public. Allocation dashboards, investment management tools, portfolio allocation, optimization, risk assessment, simulation, and forecasting. The tools of quantitative analysts and financial planners in hands of the regular investor and general public.


# Roadmap 
Feel free to submit a PR if you want to add items to the Roadmap!

### Version 1.0 (MVP)

- [ ] LandingPage #9
- [x] Login #2
- [x] Onboarding #25 
- [ ] Search for securities
- [ ] Watchlist #8
    - Actions: Add/Delete
- [ ] Dashboard 
    - Total value, gains, percentage gains
    - Performance chart
    - Asset Type overview (Stock, bonds, cash...)
- [ ] Transactions #7
    - Show all buy/sell/split transactions
    - Actions: Add/Edit/Delete
- [ ] Holdings
    - shares, purchase date, average price, initial value, current price, current value, increase value, increase percentage, percentage of portfolio
    - actions: Buy/Sell/View
- [ ] Stock Detail Page
- [ ] Fund Detail Page
- [ ] Settings
    - Default Currency
    - Download/Backup personal Data
    - Delete Account

### Version 1.1
- [ ] CSV import/export of holdings
- [ ] Multiple Accounts  #6
    - Show all accounts by this user
    - Actions: Add/Edit/Delete
- [ ] Non-financial/custom assets #3

### Version 1.2
- [ ] Allocations
    - Type (stock, bond, cash ...)
    - Industry (Tech, Consumer goods ...) 
    - Region (US, Europe, Asia ...)
- [ ] Analytics
    - Volatility
    - Diversity #51 
    - Performance

### Planned Features
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


## Notes

### A note on Warranty and Limitation of Liability.

We are not in any way professional traders, financials experts or financial advisors. This is an open source project created by passionate developers for free.

Considering that this application is related to the financial sector and stock market, there is a special attention that was drawn toward ensuring accuracy of the information displayed and how the handling of confidential information is made. 

That said, the good faith and commitment of the team in this project shall not be in any case confused for a warranty of any sort.

Please refer to section `16` and `17` of  the [LICENSE](LICENSE) for any details

### A note on Security and data privacy
This project handle private financial informations, our goal is to protect to a maximum each users privacy and confidential informations.

That said, once again, the good faith and commitment of the team in this project shall not be in any case confused for a warranty of any sort.

The information exchanged between the client and server are on a [need to know](https://en.wikipedia.org/wiki/Need_to_know) basis. That means, that we will use client-sie encryption on all the data we can in order to ensure that even in a case of a security issue, your personal data is protected.

#### Examples
| Type of data                          | Client side encryption                  | Why?                                    |
| ------------------------------------- | --------------------------------------- | --------------------------------------- |
| # of shares bougth or sold            | Yes :closed_lock_with_key:	          | No need to know for the server          |
| Date of purchace order                | No                                      | Server need to filter and sort orders   |
| Ticker symbol of order                | No                                      | Server need to process time-series and pre-fetch API data |
| Name of your private  Watchlists      | Yes :closed_lock_with_key:              | No need to know                         | 
| Name of your shared   Watchlists      | No                                      | Name need to be stored in text to allow other users to see it |
| Name of your Accounts/Assets          | Yes :closed_lock_with_key:              | No need to know                         | 

### A note on cryptography and data protection
This project has not been, for now, reviewed by an independent security firm. We are open to a partnership.





