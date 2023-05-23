:character y You 1
:character m May 2
:rideid 2
:ridename May
:default y

# start

m}Hello, I had an appointment with Uplift, are you my driver?
Yes, that would be me. You would be temp then, I assume?
m}Indeed.
Well then, what brought you here today?
m}It's about my husband, you see...
m}[He works so much:much_work], I worry it will [start affecting his health:health_affect].
m}I've been trying to tell him this too, but he doesn't really listen.
m}It's quite frustrating, because it's so harmful to him.
He won't listen to you?
m}Not really, no. It's like work is the only thing on his mind.
m}[Nothing like it used to be...:used_to_be]
m}But that's all in the past now, and I'm not sure what to do.
:end

# health_affect

Affecting his health, you say. Any reason to think that's the case?
m}Well, obviously working too much is bad for you.
I agree, but are there any signs that verify that?
m}Hmm... He's been having trouble sleeping recently, That's the biggest thing that worries me.
That's certainly problematic.
m}Well, his work [isn't the best:safety] for health too.
:end
//half convinced

# much_work

You say he's been working a lot, but how much is that?
m}Well, it's pretty much the only thing he does. He has no free time.
m}He has mentioned he's under a lot of pressure, too.
That certainly sounds worrisome.

## safety

m}There's also the safety of his work.
Oh? could you elaborate?
m}He works at a chemical plant, and there are some risks associated with that.
Chemical plant, hmm. Surely there's a lot of safety rules in place, right?
m}Yeah, I regularly hear complaints about the strict regulations.
m}It seems like the enforcement is lax though.
That sounds dangerous. Have there been any accidents?
m}Not recently, as far as I know. But there have been some [nasty accidents:nasty_incidents] in the past.
How does your husband view the issue?
m}[I don't think:question_relationship] he sees it as an issue, judging from the fact he still works there.
I'm sure He's being careful.
:end
//convinced partially, he will work less.

### nasty_incidents
What kind of incidents?
m}Really gruesome ones.
did your husband ever get involved?
m}[Yes:yes], but I don't wanna talk about it.
I understand.
:end

# yes
What happened?
m}Do you even listen to what I'm saying?
:patience -10
:end

# question_relationship

That sounds like an assumption, Have you actually spoken to him about it?
m}No, I haven't really.
That might be a good place to start.
m}Actually, we [haven't been talking much:not_talking_much] at all recently.
Oh, why is that?
m}He's been very busy with work, and when he gets home, I'm already on my way to bed.
m}Much different from what it [used to be:used_to_be].
m}It's unfortunate, but I'm not sure [how to change it:want_to_change].
//end

### not_talking_much
Has he been so busy with work?
m}Yes, he puts all his focus and time into it.
Did you try pursuing him about talking more?
m}I tried, but it [didn't change:didn't_change] the matter much.
:end

### didn't_change
Are you sure he has been busy with work?
m}Are you implying he is doing things behind my back?!
:patience -100
:end

### want_to_change

So I assume you would like to see that changed?
m}Of course. The way it currently is isn't great for either of us.
What are you missing from what it used to be?
m}Mostly [more interactions:more_interactions], I think.
m}We just rarely talk anymore. [In the past we used to talk a lot more:used_to_be]
//end

## more_interactions
What kind of interactions?
m}We used to go out more.
Did you try to do more again?
m}[We tried:tried] but his work was in the way.
:end

# tried
Are you sure that you tried enough?
m}Yes, otherwise I wouldn't be coming here
:patience -10
:end

# used_to_be

Then it wasn't always like this, right?
m}Yes, we used to talk much more, and go out every now and then.
m}I guess we also don't really go on vacations anymore, recently I've just been going on my own.
On vacation?
m}Well, short day trips. I don't really want to go on vacation without him. That would feel wrong, I think.
Is there a concrete reason why you've stopped going on vacations together?
m}Yeah. He has no time outside of work.
m}I do miss those times together quite a lot.
:end
//end where he is fully convinced.
