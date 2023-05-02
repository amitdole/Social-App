using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MessagesController : BaseApiController
{
    private readonly IUserRepository _userRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IMapper _mapper;

    public MessagesController(IUserRepository userRepository, IMessageRepository messageRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _messageRepository = messageRepository;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
    {
        var username = User.GetUserName();

        if (username.Equals(createMessageDto.RecipientUserName))
        {
            return BadRequest("You cant send messages to yourself");
        }

        var sender = await _userRepository.GetUserByUserNameAsync(username);
        var recipient = await _userRepository.GetUserByUserNameAsync(createMessageDto.RecipientUserName);

        if (sender == null) { return NotFound(); }

        var message = new Message
        {
            Sender = sender,
            Recipient = recipient,
            SenderUserName = sender.UserName,
            RecipientUserName = recipient.UserName,
            Content = createMessageDto.Content
        };

        _messageRepository.AddMessage(message);

        if (await _messageRepository.SaveAllAsync())
        {
            return Ok(_mapper.Map<MessageDto>(message));
        }

        return BadRequest("Failed to send");
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<MessageDto>>> GetMessagesForUser([FromQuery]
    MessageParams messageParams)
    {
        messageParams.UserName = User.GetUserName();

        var messages = await _messageRepository.GetMessagesForUser(messageParams);

        Response.AddPaginationHeader(new PaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages));

        return messages;
    }

    [HttpGet("thread/{username}")]
    public async Task<ActionResult<PagedList<MessageDto>>> GetMessageThread(string username)
    {

        var currentusername = User.GetUserName();

        return Ok(await _messageRepository.GetMessageThread(currentusername, username));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMessage(int id)
    {
        var userName = User.GetUserName();

        var message = await _messageRepository.GetMessage(id);

        if (message.SenderUserName != userName && message.RecipientUserName != userName)
        {
            return Unauthorized();
        }

        if (message.SenderUserName == userName)
        {
            message.SenderDeleted = true;
        }

        if (message.RecipientUserName == userName)
        {
            message.ReceiientDeleted = true;
        }

        if (message.SenderDeleted && message.ReceiientDeleted)
        {
            _messageRepository.DeleteMessage(message);
        }

        if (await _messageRepository.SaveAllAsync())
        {
            return Ok();
        }

        return BadRequest("Problem deleting message");
    }
}