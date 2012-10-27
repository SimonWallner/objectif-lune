#ifndef OBJECTIF_LUNE_MESSAGE_CALLBACK_HPP
#define OBJECTIF_LUNE_MESSAGE_CALLBACK_HPP

namespace objectifLune
{
	class MessageCallback
	{
	public:
		virtual void onMessage(std::string message) = 0;
	};
}

#endif
