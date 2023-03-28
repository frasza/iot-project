# Seminarska naloga pri projektu Internet stvari in inovativne tehnologije

## Struktura

Repozitorij je sestavljen iz treh komponent oz. aplikacij.

- Server: prestavlja strežnik, ki izpostavi spletni vtičnik, preko katerega se pošiljajo JSON sporočila med spletnim vmesnikom in Arduinom.
- Arduino: predstavlja kodo, ki omogoča kontroliranje Arduina s pomočjo jezika JavaScript in skrbi za komuniciranje stanja preko sporočil v obliki JSON formata
- App: predstavlja aplikacijo spletnega vmesnika, ki s pomočjo spletnega vtičnika v realnem času prikazuje meritve fotoresistorja in ponuja možnosti vklopa/izklopa ter prikazuje stanje.
