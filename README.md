# GoPlan-app

## Intent

We seek to create a financial planning platform for the general public. Allocation dashboards, investment management tools, portfolio allocation, optimization, risk assessment, simulation, and forecasting. The tools of quantitative analysts and financial planners in hands of the regular investor and general public.



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





