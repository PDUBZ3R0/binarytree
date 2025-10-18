# Diverse-Sets

Special collections for special situations. 

## DisArray

An array that implements completely random sorting. 

**static** *fromArray*(array)

Creates a DisArray from an existing array.

*disarrange*(times)
**times** number of passes.

Change the random order of the items in the array.

*displace*(item)
**item** item to add.

Add a new item at a random location.
(The *push* method also does this for DisArray).


## ExclusionList

A high-performance sorted list enforcing uniqueness and exclusions.

**static** *fromArray*(exclude)

Creates an ExclusionList from an existing array.

*push*(item | [ item ])

Add item(s).

*remove*(item | [ item ])

Add item(s).

**async** *export*() returns Promise<item[]>
Returns the sorted list.

**async** *disarray*() returns Promise<item[]>
Retrns the list in random order.