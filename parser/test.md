:character y You 1
:character p Paolo 2
:default p
:rideid 1

# start

text line 1 (door paulo, is default)
y] text line 2 (door "you", wegens de 'y]' )
dit is een branch, de knop zegt {hallo:branch_hallo} en gaat naar "branch_hallo"
:end
//de end hierboven geeft aan dat er geen continue knop meer is. als je toch naar de volgende branch wil gaan moet je :fallthrough gebruiken.

# branch_hallo

bij de tweede branch nu.
hier is een voorbeeld van een fallthrough. deze gaat gewoon verder naar de volgende branch (die er direct onder staat).

## branch_hallo_label

de derde branch.
om het nu af te sluiten en naar de reviews te gaan, moet je gewoon een :end aan het einde zetten zonder dat er een branch knop zit in de regel erboven.
:end
